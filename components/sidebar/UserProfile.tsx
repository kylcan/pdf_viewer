import { User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSettings } from "@/contexts/settings-context"

interface UserProfileProps {
  collapsed: boolean
  onSettingsClick: () => void
}

export function UserProfile({ collapsed, onSettingsClick }: UserProfileProps) {
  const { translations } = useSettings()

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-100 dark:bg-[#3A3A3A] p-4 profile-area">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 px-2 hover:bg-gray-200 dark:hover:bg-[#454545]"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-[#454545] flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            {!collapsed && (
              <span className="text-sm font-medium text-gray-800 dark:text-white">User Name</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 bg-white dark:bg-[#3A3A3A] border-gray-200 dark:border-[#454545]"
          align="start"
        >
          <div className="space-y-4">
            <div className="font-medium text-gray-800 dark:text-white">User Name</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">user@example.com</div>
            <div className="border-t border-gray-200 dark:border-[#454545]" />
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#454545]"
              onClick={(e) => {
                e.stopPropagation()
                onSettingsClick()
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              {translations.settings}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#454545]"
              onClick={(e) => e.stopPropagation()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {translations.logout}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}