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
import useAdminExchangeCourseUnitsSearch from "../../../hooks/admin/useAdminExchangeCourseUnitsSearch";
import useAdminExchangeCourseUnits from "../../../hooks/admin/useAdminExchangeCourseUnits";
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
import { CourseUnitInfo } from "../../../@types";


interface ManageAdminCourseUnitsProps {
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



export function ManageAdminCourseUnits({ open, onOpenChange, selectedAdmin }: ManageAdminCourseUnitsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseUnit, setSelectedCourseUnit] = useState<CourseUnitInfo | null>(null);
  const { courseUnits: searchCourseUnits, loading: searchLoading, error: searchError } = useAdminExchangeCourseUnitsSearch(searchTerm);
  const { courseUnits: adminCourseUnits, loading: adminLoading, error: adminError, mutate } = useAdminExchangeCourseUnits(selectedAdmin?.username);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [courseUnitToRemove, setCourseUnitToRemove] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSelectCourseUnit = (courseUnit: CourseUnitInfo) => {
    setSelectedCourseUnit(courseUnit);
    setSearchTerm(`${courseUnit.acronym} - ${courseUnit.name}`);
  };

  const handleAddCourseUnit = async () => {
    if (!selectedCourseUnit) return;
    try {
      const res = await fetch(`${api.BACKEND_URL}/exchange/admin/course_units/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          [api.csrfTokenName()]: api.getCSRFToken()
        },
        body: JSON.stringify({ 
          course_unit_id: selectedCourseUnit.id,
          admin_username: selectedAdmin?.username
        }),
      });
      if (res.ok) {
        mutate(); // Refresh the list
        toast({
          title: "Sucesso",
          description: "Cadeira adicionada com sucesso",
        });
        setSearchTerm("");
        setSelectedCourseUnit(null);
      } else {
        const errorData = await res.json();
        toast({
          title: "Erro",
          description: errorData.error || 'Falha ao adicionar cadeira',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: 'Falha ao adicionar cadeira',
        variant: "destructive",
      });
    }
  };

  const handleRemoveCourseUnit = (courseUnitId: number) => {
    setCourseUnitToRemove(courseUnitId);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveCourseUnit = async () => {
    if (!courseUnitToRemove) return;
    try {
      const url = new URL(`${api.BACKEND_URL}/exchange/admin/course_units/${courseUnitToRemove}/`);
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
          description: "Cadeira removida com sucesso",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Erro",
          description: errorData.error || 'Falha ao remover cadeira',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: 'Falha ao remover cadeira',
        variant: "destructive",
      });
    }
    setConfirmDialogOpen(false);
    setCourseUnitToRemove(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Gerir cadeiras de {selectedAdmin ? `${selectedAdmin.first_name} ${selectedAdmin.last_name}`.trim() || selectedAdmin.username : 'Admin'}</DialogTitle>
            <DialogDescription>
              Adicione ou remova cadeiras que você administra.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <h3 className="text-lg font-semibold">Adicionar Cadeira</h3>
              <div className="grid gap-2 py-2">
                <div className="relative">
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSelectedCourseUnit(null);
                    }}
                    placeholder="Procurar cadeira..."
                  />
                  {searchError && <p className="text-sm text-red-600">Falha ao carregar cadeiras</p>}
                  {searchCourseUnits && searchCourseUnits.length > 0 && !selectedCourseUnit && searchTerm.trim() && (
                    <div className="absolute top-full left-0 right-0 z-10 max-h-40 overflow-y-auto border border-t-0 rounded-b-md bg-white dark:bg-gray-800 shadow-lg">
                      {searchCourseUnits.map((cu: CourseUnitInfo) => (
                        <div
                          key={cu.id}
                          className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                            selectedCourseUnit?.id === cu.id ? "bg-primary text-primary-foreground" : ""
                          }`}
                          onClick={() => handleSelectCourseUnit(cu)}
                        >
                          <div className="font-medium">{cu.acronym}</div>
                          <div className="text-sm text-muted-foreground">
                            {cu.name} - {cu.course_acronym}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleAddCourseUnit} disabled={!selectedCourseUnit || adminCourseUnits?.some(cu => cu.id === selectedCourseUnit.id)}>
                  Adicionar Cadeira
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Cadeiras Atuais</h3>
              {adminLoading && <p>Carregando cadeiras…</p>}
              {adminError && <p className="text-red-600">Falha ao carregar cadeiras</p>}
              {adminCourseUnits && adminCourseUnits.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {adminCourseUnits.map((cu: any) => (
                    <div key={cu.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{cu.acronym}</div>
                        <div className="text-sm text-muted-foreground">{cu.name}</div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveCourseUnit(cu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {adminCourseUnits && adminCourseUnits.length === 0 && !adminLoading && (
                <p className="text-muted-foreground">Nenhuma cadeira atribuída.</p>
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
            <AlertDialogTitle>Remover Cadeira</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta cadeira? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveCourseUnit} className="bg-red-600 text-white hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
