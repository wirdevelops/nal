"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RoleForm } from "../forms/RoleForm"

interface EditRoleModalProps {
  open: boolean;
  onClose: () => void;
  role: any;
}

export function EditRoleModal({ open, onClose, role }: EditRoleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role: {role?.name}</DialogTitle>
        </DialogHeader>
        <RoleForm onSubmit={() => onClose()} defaultValues={role} />
      </DialogContent>
    </Dialog>
  )
}