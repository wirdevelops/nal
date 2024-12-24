"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function RoleForm({ onSubmit, defaultValues }: { onSubmit: (data: any) => void; defaultValues?: any }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input id="name" defaultValue={defaultValues?.name} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" defaultValue={defaultValues?.description} />
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )
}