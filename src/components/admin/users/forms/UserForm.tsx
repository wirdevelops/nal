"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserFormProps {
  onSubmit: (data: any) => void
  defaultValues?: any
}

export function UserForm({ onSubmit, defaultValues }: UserFormProps) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue={defaultValues?.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={defaultValues?.email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select defaultValue={defaultValues?.role}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )
}