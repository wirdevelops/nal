"use client"

import { useState } from "react"
import { UserStats } from "./analytics/UserStats"
import { UserTable } from "./table/UserTable"
import { AddUserModal } from "./modals/AddUserModal"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function UserManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserStats />
      <UserTable />
      <AddUserModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  )
}