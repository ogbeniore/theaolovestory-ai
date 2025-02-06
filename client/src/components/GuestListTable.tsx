import { Guest } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GuestListTableProps {
  guests: Guest[];
}

export default function GuestListTable({ guests }: GuestListTableProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<Guest>>({});

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Guest> }) => {
      const res = await apiRequest("PATCH", `/api/guests/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      setEditingId(null);
      setEditValues({});
      toast({
        title: "Success",
        description: "Guest updated successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/guests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      toast({
        title: "Success",
        description: "Guest deleted successfully",
      });
    },
  });

  const handleEdit = (guest: Guest) => {
    setEditingId(guest.id);
    setEditValues(guest);
  };

  const handleSave = (id: number) => {
    updateMutation.mutate({ id, updates: editValues });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Attending</TableHead>
            <TableHead>Plus One</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>
                {editingId === guest.id ? (
                  <Input
                    value={editValues.name ?? guest.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                  />
                ) : (
                  guest.name
                )}
              </TableCell>
              <TableCell>
                {editingId === guest.id ? (
                  <Input
                    value={editValues.email ?? guest.email ?? ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, email: e.target.value })
                    }
                  />
                ) : (
                  guest.email
                )}
              </TableCell>
              <TableCell>
                {guest.isAttending ? "Yes" : guest.isAttending === false ? "No" : "Pending"}
              </TableCell>
              <TableCell>{guest.plusOne ? "Yes" : "No"}</TableCell>
              <TableCell>
                {editingId === guest.id ? (
                  <Input
                    type="number"
                    value={editValues.tableNumber ?? guest.tableNumber ?? ""}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        tableNumber: parseInt(e.target.value) || null,
                      })
                    }
                  />
                ) : (
                  guest.tableNumber || "-"
                )}
              </TableCell>
              <TableCell>
                {editingId === guest.id ? (
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(guest.id)}
                      disabled={updateMutation.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(guest)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMutation.mutate(guest.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
