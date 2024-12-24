"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Role } from '@/types'

const AVAILABLE_PERMISSIONS = [
  { id: 'users.view', label: 'View Users' },
  { id: 'users.create', label: 'Create Users' },
  { id: 'users.edit', label: 'Edit Users' },
  { id: 'users.delete', label: 'Delete Users' },
  { id: 'roles.view', label: 'View Roles' },
  { id: 'roles.create', label: 'Create Roles' },
  { id: 'roles.edit', label: 'Edit Roles' },
  { id: 'roles.delete', label: 'Delete Roles' },
  { id: 'content.view', label: 'View Content' },
  { id: 'content.create', label: 'Create Content' },
  { id: 'content.edit', label: 'Edit Content' },
  { id: 'content.delete', label: 'Delete Content' },
]

interface RolePermissionsProps {
  role: Role
  onSave: (permissions: string[]) => void
  onCancel: () => void
}

export function RolePermissions({ role, onSave, onCancel }: RolePermissionsProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role.permissions)

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(current => {
      if (current.includes(permissionId)) {
        return current.filter(id => id !== permissionId)
      } else {
        return [...current, permissionId]
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(selectedPermissions)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          Permissions for {role.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_PERMISSIONS.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox
                id={permission.id}
                checked={selectedPermissions.includes(permission.id)}
                onCheckedChange={() => handlePermissionToggle(permission.id)}
              />
              <Label htmlFor={permission.id}>{permission.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  )
}