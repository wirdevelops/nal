"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

export function RoleStatusForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Update Status</Button>
      </form>
    )
  }