"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



export function UserBanForm({ onSubmit }: { onSubmit: (data: any) => void }) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reason">Ban Reason</Label>
          <Input id="reason" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="permanent">Permanent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" variant="destructive" className="w-full">Ban User</Button>
      </form>
    )
  }