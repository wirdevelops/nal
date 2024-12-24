"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RoleForm } from "../forms/RoleForm"

interface AddRoleModalProps {
  open: boolean
  onClose: () => void
}

export function AddRoleModal({ open, onClose }: AddRoleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
        </DialogHeader>
        <RoleForm onSubmit={() => onClose()} />
      </DialogContent>
    </Dialog>
  )
}