"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserForm } from "../forms/UserForm"

interface AddUserModalProps {
  open: boolean
  onClose: () => void
}

export function AddUserModal({ open, onClose }: AddUserModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <UserForm onSubmit={() => onClose()} />
      </DialogContent>
    </Dialog>
  )
}