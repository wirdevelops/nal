"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserForm } from "../forms/UserForm"

export function EditUserModal({ open, onClose, user }: { open: boolean; onClose: () => void; user: any }) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={() => onClose()} defaultValues={user} />
        </DialogContent>
      </Dialog>
    )
  }