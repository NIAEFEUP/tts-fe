import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button";
import useAdminExchangeAdmins from "../../hooks/admin/useAdminExchangeAdmins";
import { AddAdminDialog } from "./manage/AddAdminDialog";
import { ManageAdminCourses } from "./manage/ManageAdminCourses";
import { ManageAdminCourseUnits } from "./manage/ManageAdminCourseUnits";
import api from "../../api/backend";
import { useToast } from "../ui/use-toast";
import { Trash2, Book, FileText } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import AdminPaginationContext from "../../contexts/admin/AdminPaginationContext";
import { AdminPagination } from "../admin/AdminPagination";

const getCsrfToken = () => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return '';
};

type AdminRow = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  date_joined: string | null;
}

export const AdminsExchangeManageAdmins = () => {
  const [currPage, setCurrPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { admins, totalPages: apiTotalPages, loading, error, mutate } = useAdminExchangeAdmins(currPage, 10);
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [coursesDialogOpen, setCoursesDialogOpen] = useState(false);
  const [courseUnitsDialogOpen, setCourseUnitsDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
  const { toast } = useToast();

  // Update totalPages when API data changes
  useEffect(() => {
    setTotalPages(apiTotalPages);
  }, [apiTotalPages]);

  const filtered: AdminRow[] | null = admins
    ? admins.filter((a: AdminRow) =>
        `${a.username} ${a.first_name} ${a.last_name}`.toLowerCase().includes(q.toLowerCase())
      )
    : null;

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrPage(1);
  }, [q]);

  const handleAddAdmin = async (username: string) => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/exchange/admin/admins/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        mutate(); // Refresh the list
        toast({
          title: "Sucesso",
          description: "Admin adicionado com sucesso",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Erro",
          description: errorData.error || 'Falha ao adicionar admin',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: 'Falha ao adicionar admin',
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = (username: string) => {
    setAdminToRemove(username);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveAdmin = async () => {
    if (!adminToRemove) return;
    try {
      const res = await fetch(`${api.BACKEND_URL}/exchange/admin/admins/${adminToRemove}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
      });
      if (res.ok) {
        mutate(); // Refresh the list
        toast({
          title: "Sucesso",
          description: "Admin removido com sucesso",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Erro",
          description: errorData.error || 'Falha ao remover admin',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: 'Falha ao remover admin',
        variant: "destructive",
      });
    }
    setConfirmDialogOpen(false);
    setAdminToRemove(null);
  };

  return (
    <AdminPaginationContext.Provider value={{
      currPage,
      setCurrPage,
      totalPages,
      setTotalPages
    }}>
      <div className="flex flex-col gap-y-4 p-4">
      <div>
        <h1 className="text-3xl font-bold">Gerir Admins</h1>
      </div>
      <div className="flex gap-4">
        <Input
          placeholder="Procurar admins atuais"
          className="my-4"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="default" className="mb-4 bg-primary my-auto" onClick={() => setDialogOpen(true)}>Adicionar Admin +</Button>
      </div>

      {loading && <p>Carregando admins…</p>}
      {error && <p className="text-red-600">Falha ao carregar admins</p>}

      {filtered && (
        <div className="overflow-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Numero UP</th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Mail</th>
                <th className="p-2 text-left">Ativo</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: AdminRow) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.username}</td>
                  <td className="p-2">{`${a.first_name || ""} ${a.last_name || ""}`}</td>
                  <td className="p-2">{a.email}</td>
                  <td className="p-2">{a.is_active ? "Yes" : "No"}</td>
                  <td className="p-2 flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(a);
                        setCoursesDialogOpen(true);
                      }}
                      title="Gerir Cursos"
                    >
                      <Book className="h-4 w-4 mr-1" />
                      Cursos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(a);
                        setCourseUnitsDialogOpen(true);
                      }}
                      title="Gerir Cadeiras"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Cadeiras
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAdmin(a.username)}
                      title="Remover Admin"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AddAdminDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAddAdmin={handleAddAdmin}
      />
      <ManageAdminCourses
        open={coursesDialogOpen}
        onOpenChange={setCoursesDialogOpen}
        selectedAdmin={selectedAdmin}
      />
      <ManageAdminCourseUnits
        open={courseUnitsDialogOpen}
        onOpenChange={setCourseUnitsDialogOpen}
        selectedAdmin={selectedAdmin}
      />
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {adminToRemove} como admin? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveAdmin} className="bg-red-600 text-white hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="mt-8">
        <AdminPagination />
      </div>
    </div>
    </AdminPaginationContext.Provider>
  )
}

export default AdminsExchangeManageAdmins