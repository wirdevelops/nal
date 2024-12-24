"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const permissions = [
  { id: "create", label: "Create" },
  { id: "read", label: "Read" },
  { id: "update", label: "Update" },
  { id: "delete", label: "Delete" },
]

export function PermissionAssignmentForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-4">
      <div className="space-y-4">
        {permissions.map((permission) => (
          <div key={permission.id} className="flex items-center space-x-2">
            <Checkbox id={permission.id} />
            <Label htmlFor={permission.id}>{permission.label}</Label>
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full">Update Permissions</Button>
    </form>
  )
}