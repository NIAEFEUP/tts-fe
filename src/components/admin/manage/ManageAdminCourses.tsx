import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import useAdminExchangeCoursesSearch from "../../../hooks/admin/useAdminExchangeCoursesSearch";
import useAdminExchangeCourses from "../../../hooks/admin/useAdminExchangeCourses";
import api from "../../../api/backend";
import { useToast } from "../../ui/use-toast";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { CourseInfo } from "../../../@types";



interface ManageAdminCoursesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAdmin?: AdminRow;
}

type AdminRow = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  date_joined: string | null;
}

export function ManageAdminCourses({ open, onOpenChange, selectedAdmin }: ManageAdminCoursesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CourseInfo | null>(null);
  const { courses: searchCourses, loading: searchLoading, error: searchError } = useAdminExchangeCoursesSearch(searchTerm);
  const { courses: adminCourses, loading: adminLoading, error: adminError, mutate } = useAdminExchangeCourses(selectedAdmin?.username);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSelectCourse = (course: CourseInfo) => {
    setSelectedCourse(course);
    setSearchTerm(`${course.acronym} - ${course.name}`);
  };

  const handleAddCourse = async () => {
    if (!selectedCourse) return;
    try {
      const res = await fetch(`${api.BACKEND_URL}/exchange/admin/courses/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          [api.csrfTokenName()]: api.getCSRFToken()
        },
        body: JSON.stringify({ 
          course_id: selectedCourse.id,
          admin_username: selectedAdmin?.username
        }),
      });
      if (res.ok) {
        mutate(); // Refresh the list
        toast({
          title: "Sucesso",
          description: "Curso adicionado com sucesso",
        });
        setSearchTerm("");
        setSelectedCourse(null);
      } else {
        const errorData = await res.json();
        toast({
          title: "Erro",
          description: errorData.error || 'Falha ao adicionar curso',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: 'Falha ao adicionar curso',
        variant: "destructive",
      });
    }
  };

  const handleRemoveCourse = (courseId: number) => {
    setCourseToRemove(courseId);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveCourse = async () => {
    if (!courseToRemove) return;
    try {
      const url = new URL(`${api.BACKEND_URL}/exchange/admin/courses/${courseToRemove}/`);
      if (selectedAdmin?.username) {
        url.searchParams.set('admin_username', selectedAdmin.username);
      }
      
      const res = await fetch(url.toString(), {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          [api.csrfTokenName()]: api.getCSRFToken()
        },
      });
      if (res.ok) {
        mutate(); // Refresh the list
        toast({
          title: "Sucesso",
          description: "Curso removido com sucesso",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Erro",
          description: errorData.error || 'Falha ao remover curso',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: 'Falha ao remover curso',
        variant: "destructive",
      });
    }
    setConfirmDialogOpen(false);
    setCourseToRemove(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gerir cursos de {selectedAdmin ? `${selectedAdmin.first_name} ${selectedAdmin.last_name}`.trim() || selectedAdmin.username : 'Admin'}</DialogTitle>
            <DialogDescription>
              Adicione ou remova cursos que você administra.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h3 className="text-lg font-semibold">Adicionar Curso</h3>
              <div className="grid gap-2 py-2">
                <div className="relative">
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedCourse(null);
                    }}
                    placeholder="Procurar curso..."
                  />
                  {searchError && <p className="text-sm text-red-600">Falha ao carregar cursos</p>}
                  {searchCourses && searchCourses.length > 0 && !selectedCourse && searchTerm.trim() && (
                    <div className="absolute top-full left-0 right-0 z-10 max-h-40 overflow-y-auto border border-t-0 rounded-b-md bg-white dark:bg-gray-800 shadow-lg">
                      {searchCourses.map((c: CourseInfo) => (
                        <div
                          key={c.id}
                          className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                            selectedCourse?.id === c.id ? "bg-primary text-primary-foreground" : ""
                          }`}
                          onClick={() => handleSelectCourse(c)}
                        >
                          <div className="font-medium">{c.acronym}</div>
                          <div className="text-sm text-muted-foreground">
                            {c.name} 
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleAddCourse} disabled={!selectedCourse || adminCourses?.some(c => c.id === selectedCourse.id)}>
                  Adicionar Curso
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Cursos Atuais</h3>
              {adminLoading && <p>Carregando cursos…</p>}
              {adminError && <p className="text-red-600">Falha ao carregar cursos</p>}
              {adminCourses && adminCourses.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {adminCourses.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{c.acronym}</div>
                        <div className="text-sm text-muted-foreground">{c.name}</div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCourse(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {adminCourses && adminCourses.length === 0 && !adminLoading && (
                <p className="text-muted-foreground">Nenhum curso atribuído.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Curso</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este curso? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveCourse} className="bg-red-600 text-white hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
