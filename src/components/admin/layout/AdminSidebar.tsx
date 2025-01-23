// components/admin/layout/AdminSidebar.tsx
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { adminNavigation } from "@/lib/constants/navigation"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  return (
    <div className={cn(
      "relative h-screen border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-40 rounded-full border bg-background"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          {!isCollapsed && (
            <h2 className="mb-6 px-4 text-lg font-semibold">
              Nalevel Empire
            </h2>
          )}
          <nav className="space-y-2">
            {adminNavigation.map((item) => (
              <div key={item.href}>
                {item.submenu ? (
                  <Collapsible
                    open={openSubmenu === item.href && !isCollapsed}
                    onOpenChange={() => setOpenSubmenu(openSubmenu === item.href ? null : item.href)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          pathname.startsWith(item.href) && "bg-muted"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")} />
                        {!isCollapsed && (
                          <>
                            {item.title}
                            <ChevronRight className={cn(
                              "ml-auto h-4 w-4 transition-transform",
                              openSubmenu === item.href && "rotate-90"
                            )} />
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 px-6 py-1">
                      {!isCollapsed && item.submenu.map((subitem) => (
                        <Link key={subitem.href} href={subitem.href}>
                          <Button
                            variant={pathname === subitem.href ? "secondary" : "ghost"}
                            className="w-full justify-start"
                          >
                            {subitem.title}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link href={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        pathname === item.href && "bg-muted"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isCollapsed ? "mx-auto" : "mr-2")} />
                      {!isCollapsed && item.title}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}