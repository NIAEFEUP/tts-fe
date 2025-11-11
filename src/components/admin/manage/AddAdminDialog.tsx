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

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAdmin: (username: string) => void;
}

type Candidate = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};

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
          <DialogTitle>Add Admin</DialogTitle>
          <DialogDescription>
            Search for a user to add as an admin.
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
            placeholder="Enter username..."
          />
          {error && <p className="text-sm text-red-600">Failed to load candidates</p>}
          {candidates && candidates.length > 0 && !selectedUser && (
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
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!selectedUser}>
            Add Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}