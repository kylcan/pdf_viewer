import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/contexts/settings-context"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const { translations } = useSettings()

  return (
    <div className="px-4 pb-2 search-area">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <Input
          type="text"
          placeholder={translations.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 bg-white dark:bg-[#454545] border-gray-300 dark:border-gray-600 focus-visible:ring-1 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 text-gray-800 dark:text-white dark:placeholder-gray-400"
        />
      </div>
    </div>
  )
}