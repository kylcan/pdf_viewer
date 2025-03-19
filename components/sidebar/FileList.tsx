import { FileText, Upload } from "lucide-react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorIcon } from "@/components/error-icon"
import { ProgressBar } from "@/components/progress-bar"
import type { PdfFile } from "@/types"
import { useSettings } from "@/contexts/settings-context"

interface FileListProps {
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
}

export function FileList({
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
}: FileListProps) {
  const { translations, theme } = useSettings()

  // Format date to a readable string
  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (files.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Upload className={`h-10 w-10 ${theme === "light" ? "text-blue-500" : "text-white"} mb-3`} />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span className="text-gray-800 dark:text-white">{translations.uploadInstructions}</span>
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{translations.pdfOnly}</p>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20 uploaded-files-area">
      <ul className="space-y-1">
        {files.map((file) => (
          <ContextMenu key={file.name}>
            <ContextMenuTrigger className="context-menu-trigger">
              <li
                className="relative group"
                draggable={true}
                onDragStart={(e: React.DragEvent<HTMLLIElement>) => {
                  e.dataTransfer.setData("text/plain", file.name)
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.querySelector('[data-state="open"]')) {
                    onMouseEnter(file.name, e)
                  }
                }}
                onMouseLeave={onMouseLeave}
              >
                <div
                  className={`flex flex-col p-2 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-[#454545] ${
                    selectedFile?.name === file.name ? "bg-gray-200 dark:bg-[#454545]" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileClick(file)
                  }}
                >
                  <div className="flex items-center h-6">
                    <div className="w-6 h-6 flex items-center justify-center mr-2 shrink-0">
                      {file.status === "uploading" || file.status === "processing" ? (
                        <LoadingSpinner />
                      ) : file.status === "error" ? (
                        <ErrorIcon className={`h-4 w-4 ${theme === "light" ? "text-red-500" : "text-red-400"}`} />
                      ) : (
                        <FileText className={`h-4 w-4 ${theme === "light" ? "text-blue-500" : "text-white"}`} />
                      )}
                    </div>
                    <span className={`text-sm ${theme === "light" ? "text-gray-800" : "text-white"} truncate`}>
                      {file.name}
                    </span>
                  </div>

                  {file.status === "uploading" && (
                    <div className="mt-2">
                      <ProgressBar progress={file.progress} />
                    </div>
                  )}
                </div>

                {selectedFile?.name === file.name && file.status === "completed" && (
                  <div className="mt-1 ml-7 pr-2 text-sm max-h-24 overflow-y-auto">
                    <div className="bg-gray-100 dark:bg-[#3A3A3A] p-2 rounded">
                      {file.author && (
                        <p className="text-gray-600 dark:text-gray-300 mb-1">
                          <span className="font-medium">Author:</span> {file.author}
                        </p>
                      )}
                      {file.releaseDate && (
                        <p className="text-gray-600 dark:text-gray-300 mb-1">
                          <span className="font-medium">Published:</span> {formatDate(file.releaseDate)}
                        </p>
                      )}
                      {file.summary && <p className="text-gray-600 dark:text-gray-300">{file.summary}</p>}
                    </div>
                  </div>
                )}

                {selectedFile?.name === file.name && file.status === "error" && (
                  <div className="mt-1 ml-7 pr-2 text-sm text-red-500 dark:text-red-400">
                    Error: {file.error}
                  </div>
                )}

                {hoveredFile === file.name && file.status === "completed" && hoverPosition !== null && (
                  <div
                    className="fixed left-64 md:left-80 bg-white dark:bg-[#454545] p-3 rounded shadow-lg z-10 w-64 max-h-64 overflow-y-auto"
                    style={{ top: hoverPosition }}
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span className="font-medium">Author:</span> {file.author}
                    </p>
                    {file.releaseDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <span className="font-medium">Published:</span> {formatDate(file.releaseDate)}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Summary:</span> {file.summary}
                    </p>
                  </div>
                )}
              </li>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48 bg-white dark:bg-[#3A3A3A] dark:border-[#454545]">
              <ContextMenuItem
                className="text-red-600 dark:text-red-400"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteFile(file.name)
                }}
              >
                {translations.delete}
              </ContextMenuItem>
              {file.status === "error" && file.errorType === "upload_failed" && (
                <ContextMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onReupload(file)
                  }}
                >
                  {translations.reupload}
                </ContextMenuItem>
              )}
              {file.status === "error" && file.errorType === "analysis_failed" && (
                <ContextMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onManualInput(file.name)
                  }}
                >
                  {translations.manual}
                </ContextMenuItem>
              )}
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </ul>
    </div>
  )
}