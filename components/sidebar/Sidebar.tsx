import { ChevronLeft, ChevronRight, FileText } from "lucide-react"
import type { PdfFile } from "@/types"
import { useSettings } from "@/contexts/settings-context"
import { SearchBar } from "./SearchBar"
import { FileList } from "./FileList"
import { UserProfile } from "./UserProfile"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  files: PdfFile[]
  selectedFile: PdfFile | null
  hoveredFile: string | null
  hoverPosition: number | null
  onFileClick: (file: PdfFile) => void
  onMouseEnter: (fileName: string, e: React.MouseEvent<HTMLLIElement>) => void
  onMouseLeave: () => void
  onDeleteFile: (fileName: string) => void
  onReupload: (file: PdfFile) => void
  onManualInput: (fileName: string) => void
  onSettingsClick: () => void
  isDragging: boolean
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

export function Sidebar({
  collapsed,
  onToggle,
  searchQuery,
  setSearchQuery,
  files,
  selectedFile,
  hoveredFile,
  hoverPosition,
  onFileClick,
  onMouseEnter,
  onMouseLeave,
  onDeleteFile,
  onReupload,
  onManualInput,
  onSettingsClick,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: SidebarProps) {
  const { theme } = useSettings()

  return (
    <div
      className={`relative bg-gray-100 dark:bg-[#3A3A3A] transition-all duration-300 ${
        collapsed ? "w-12" : "w-64 md:w-80"
      } ${isDragging && !collapsed ? "bg-opacity-70" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex justify-between items-center app-name-area">
          {!collapsed && <h2 className="text-lg font-semibold text-gray-800 dark:text-white">PDF Viewer</h2>}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className="bg-gray-200 dark:bg-[#454545] text-gray-600 dark:text-gray-300 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-[#525252]"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}

        <div className="flex-1 overflow-y-auto">
          {collapsed ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FileText className={`h-4 w-4 ${theme === "light" ? "text-blue-500" : "text-white"}`} />
            </div>
          ) : (
            <FileList
              files={files}
              selectedFile={selectedFile}
              hoveredFile={hoveredFile}
              hoverPosition={hoverPosition}
              onFileClick={onFileClick}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onDeleteFile={onDeleteFile}
              onReupload={onReupload}
              onManualInput={onManualInput}
            />
          )}
        </div>

        <UserProfile collapsed={collapsed} onSettingsClick={onSettingsClick} />
      </div>
    </div>
  )
}