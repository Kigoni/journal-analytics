"use client"

import { useState } from "react"
import { User, LogOut, Settings, BookMarked, History, Sparkles, Bell, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import SubmitJournalDialog from "./submit-journal-dialog" // Ensure this path is correct

interface UserAccountNavProps {
  isLoggedIn?: boolean
}

export default function UserAccountNav({ isLoggedIn = false }: UserAccountNavProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [notifications, setNotifications] = useState(3) // Example notification count

  // Mock user data - in a real app, this would come from your auth system
  const user = isLoggedIn
    ? {
        name: "Jane Researcher",
        email: "jane.researcher@university.edu",
        image: "/placeholder.svg?height=40&width=40",
        role: "Researcher",
      }
    : null

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">AI Journal Recommendation</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    New journals matching your research interests are available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <BookMarked className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">New Volume Published</span>
                  </div>
                  <p className="text-xs text-muted-foreground">A journal you follow has published a new volume</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Account Update</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Your researcher profile has been verified</p>
                  <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="w-fit mt-1">
                    {user.role}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                  <span>AI Research Assistant</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <BookMarked className="mr-2 h-4 w-4" />
                  <span>Saved Journals</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <History className="mr-2 h-4 w-4" />
                  <span>Reading History</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button variant="ghost" className="flex items-center gap-2  border-green-500 border-4" onClick={() => setShowLoginDialog(true)}>
          <User className="h-5 w-5" />
          <span>Sign In</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      )}

      <SubmitJournalDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  )
}

