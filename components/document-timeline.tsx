"use client"

import { useState, useEffect } from "react"
// import { Calendar } from "lucide-react"
import type { PdfFile } from "@/types"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { useSettings } from "@/contexts/settings-context"

interface TimelineItem extends PdfFile {}

interface DocumentTimelineProps {
  files: PdfFile[]
  selectedFile: PdfFile | null //当前选中的文件
  onSelectFile: (file: PdfFile | null) => void //点击文件时触发
  onDeleteTimelineItem?: (fileName: string) => void
}

export function DocumentTimeline({ files, selectedFile, onSelectFile, onDeleteTimelineItem }: DocumentTimelineProps) {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
  const { translations } = useSettings()

  // Sort files by release date when they change
  useEffect(() => {
    // Sort by release date (oldest first)
    const sortedItems = [...files].sort((a, b) => {
      if (!a.releaseDate || !b.releaseDate) return 0
      return a.releaseDate.getTime() - b.releaseDate.getTime()
    })

    setTimelineItems(sortedItems)
  }, [files])

  // Format date to a readable string
  const formatDate = (date?: Date) => {
    if (!date) return "Unknown date"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="relative pl-6 after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-blue-200 dark:after:bg-gray-600">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Document Timeline</h2>
      {timelineItems
        .filter((item) => item.status === "completed")
        .map((item) => (
          <ContextMenu key={item.name}>
            <ContextMenuTrigger>
              <div
                className={`mb-1 last:mb-0 relative ${
                  selectedFile?.name === item.name ? "opacity-100" : "opacity-80 hover:opacity-100"
                }`}
              >
                <div
                  className={`absolute left-0 top-[16px] w-3 h-3 rounded-full z-10 transform -translate-x-[7px] ${
                    selectedFile?.name === item.name ? "bg-blue-500 dark:bg-blue-400" : "bg-blue-300 dark:bg-gray-500"
                  }`}
                />
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedFile?.name === item.name
                      ? "bg-blue-100 dark:bg-[#454545]"
                      : "hover:bg-blue-50 dark:hover:bg-[#404040]"
                  }`}
                  onClick={() => onSelectFile(selectedFile?.name === item.name ? null : item)}
                >
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <span>{formatDate(item.releaseDate)}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white break-all">{item.name}</h3>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48 bg-white dark:bg-[#3A3A3A] dark:border-[#454545]">
              <ContextMenuItem
                className="text-red-600 dark:text-red-400"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTimelineItem?.(item.name)
                }}
              >
                {translations.delete}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}

      {/* {timelineItems.length === 0 && (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">No documents available in the timeline</div>
      )} */}
    </div>
  )
}

