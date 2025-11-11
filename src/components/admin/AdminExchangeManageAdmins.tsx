import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button";
import useAdminExchangeAdmins from "../../hooks/admin/useAdminExchangeAdmins";
import { AddAdminDialog } from "./manage/AddAdminDialog";
import api from "../../api/backend";
import { useToast } from "../ui/use-toast";
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
} from "../ui/alert-dialog";

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
  const { admins, loading, error, mutate } = useAdminExchangeAdmins();
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
  const { toast } = useToast();

  const filtered: AdminRow[] | null = admins
    ? admins.filter((a: AdminRow) =>
        `${a.username} ${a.first_name} ${a.last_name}`.toLowerCase().includes(q.toLowerCase())
      )
    : null;

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
          title: "Success",
          description: "Admin added successfully",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || 'Failed to add admin',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: 'Failed to add admin',
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
          title: "Success",
          description: "Admin removed successfully",
        });
      } else {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.error || 'Failed to remove admin',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: 'Failed to remove admin',
        variant: "destructive",
      });
    }
    setConfirmDialogOpen(false);
    setAdminToRemove(null);
  };

  return (
    <div className="flex flex-col gap-y-4 p-4">
      <div>
        <h1 className="text-3xl font-bold">Gerir Admins</h1>
      </div>
      <div className="flex gap-4">
        <Input
          placeholder="Search for current Admins"
          className="my-4"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="default" className="mb-4 bg-primary my-auto" onClick={() => setDialogOpen(true)}>Add Admin +</Button>
      </div>

      {loading && <p>Loading admins…</p>}
      {error && <p className="text-red-600">Failed to load admins</p>}

      {filtered && (
        <div className="overflow-auto border rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Numero UP</th>
                <th className="p-2 text-left">Nome</th>
                <th className="p-2 text-left">Mail</th>
                <th className="p-2 text-left">Ativo</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: AdminRow) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.username}</td>
                  <td className="p-2">{`${a.first_name || ""} ${a.last_name || ""}`}</td>
                  <td className="p-2">{a.email}</td>
                  <td className="p-2">{a.is_active ? "Yes" : "No"}</td>
                  <td className="p-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveAdmin(a.username)}
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
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {adminToRemove} as an admin? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveAdmin} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminsExchangeManageAdmins