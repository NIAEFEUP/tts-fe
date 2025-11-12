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
import useAdminExchangeCandidates from "../../../hooks/admin/useAdminExchangeCandidates";
import { Candidate } from "../../../@types";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAdmin: (username: string) => void;
}


export function AddAdminDialog({ open, onOpenChange, onAddAdmin }: AddAdminDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<Candidate | null>(null);
  const { candidates, loading, error } = useAdminExchangeCandidates(searchTerm);

  const handleAdd = () => {
    if (selectedUser) {
      onAddAdmin(selectedUser.username);
      onOpenChange(false);
      setSearchTerm("");
      setSelectedUser(null);
    }
  };

  const handleSelectUser = (user: Candidate) => {
    setSelectedUser(user);
    setSearchTerm(`${user.username} - ${user.first_name} ${user.last_name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Admin</DialogTitle>
          <DialogDescription>
            Pesquisa pelo usuário que pretendes adicionar como admin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4 relative">
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedUser(null); 
            }}
            placeholder="Introduzir nome de utilizador..."
          />
          {error && <p className="text-sm text-red-600">Falha ao carregar candidatos</p>}
          {candidates && candidates.length > 0 && !selectedUser && searchTerm.trim() && (
            <div className="absolute top-full left-0 right-0 z-10 max-h-40 overflow-y-auto border border-t-0 rounded-b-md bg-white dark:bg-gray-800 shadow-lg">
              {candidates.map((c: Candidate) => (
                <div
                  key={c.id}
                  className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    selectedUser?.id === c.id ? "bg-primary text-primary-foreground" : ""
                  }`}
                  onClick={() => handleSelectUser(c)}
                >
                  <div className="font-medium">{c.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {c.first_name} {c.last_name} - {c.email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={!selectedUser}>
            Adicionar Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}