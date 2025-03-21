"use client"

import { useState, useRef, type DragEvent, type ChangeEvent, useEffect } from "react"
import type { PdfFile } from "@/types"
import { useSettings } from "@/contexts/settings-context"
import { SettingsDialog } from "@/components/settings-dialog"
import { DocumentTimeline } from "@/components/document-timeline"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { useFileUpload } from "@/hooks/useFileUpload"
import { ContentFooter } from "@/components/content/ContentFooter"
import { ClusterView } from "@/components/cluster-view/ClusterView"

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<PdfFile | null>(null)
  const [hoveredFile, setHoveredFile] = useState<string | null>(null)
  const [hoverPosition, setHoverPosition] = useState<number | null>(null)
  const [manualInputOpen, setManualInputOpen] = useState(false)
  const [inputContent, setInputContent] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { translations } = useSettings()
  const [showClusterButton, setShowClusterButton] = useState(false)
  const [timelineItems, setTimelineItems] = useState<string[]>([])
  const [deletedTimelineItems, setDeletedTimelineItems] = useState<string[]>([])
  const [fileCategories, setFileCategories] = useState<{ [key: string]: string }>({})
  const [showClusterView, setShowClusterView] = useState(false)
  const [isClusterLoading, setIsClusterLoading] = useState(false)
  const [deletedFromCategories, setDeletedFromCategories] = useState<string[]>([])

  const { uploadedFiles, processFiles, handleDeleteFile, handleReupload } = useFileUpload()

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      !e.target.closest(".app-name-area") &&
      !e.target.closest(".search-area") &&
      !e.target.closest(".profile-area") &&
      !e.target.closest(".uploaded-files-area") &&
      !e.target.closest(".context-menu-trigger")
    ) {
      if (!sidebarCollapsed && fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
  }

  const handleMouseEnter = (fileName: string, e: React.MouseEvent<HTMLLIElement>) => {
    if (selectedFile?.name !== fileName) {
      setHoveredFile(fileName)
      setHoverPosition(e.currentTarget.getBoundingClientRect().top)
    }
  }

  const handleMouseLeave = () => {
    setHoveredFile(null)
  }

  const handleFileClick = (file: PdfFile) => {
    if (selectedFile?.name === file.name) {
      setSelectedFile(null)
    } else {
      setSelectedFile(file)
      setHoveredFile(null)
    }
  }

  const handleManualInput = (fileName: string) => {
    setManualInputOpen(true)
  }

  const handleSendToBackend = () => {
    console.log("Sending to backend:", inputContent)
    setManualInputOpen(false)
  }

  const handleClusterClick = async () => {
    setIsClusterLoading(true)
    
    // 模拟后端分析过程
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 随机分配类别
    const categories = ["1", "2", "3"]
    const newCategories = uploadedFiles.reduce((acc, file) => {
      if (file.status === "completed") {
        acc[file.name] = categories[Math.floor(Math.random() * categories.length)]
      }
      return acc
    }, {} as { [key: string]: string })

    setFileCategories(newCategories)
    setShowClusterView(true)
    setIsClusterLoading(false)
  }

  const handleDeleteTimelineItem = (fileName: string) => {
    setTimelineItems((prev) => prev.filter((name) => name !== fileName))
    setDeletedTimelineItems((prev) => [...prev, fileName])
    if (showClusterView) {
      setDeletedFromCategories((prev) => [...prev, fileName])
    }
  }

  const filteredFiles = uploadedFiles.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const hasCompletedFiles = uploadedFiles.some(file => file.status === "completed")
    setShowClusterButton(hasCompletedFiles)
  }, [uploadedFiles])

  useEffect(() => {
    const completedFiles = uploadedFiles
      .filter(file => file.status === "completed")
      .map(file => file.name)
    setTimelineItems(completedFiles)
  }, [uploadedFiles])

  // 按类别对文件进行分组
  const groupedFiles = Object.entries(fileCategories).reduce((acc, [category, _]) => {
    acc[category] = uploadedFiles.filter(
      file => fileCategories[file.name] === category && 
      file.status === "completed" &&
      timelineItems.includes(file.name) &&
      !deletedTimelineItems.includes(file.name)
    )
    return acc
  }, {} as { [key: string]: PdfFile[] })

  return (
    <main className="flex h-screen bg-white dark:bg-[#323232]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        files={filteredFiles.map((file) => ({
          ...file,
          draggable: true,
          onDragStart: (e: React.DragEvent<HTMLLIElement>) => {
            e.dataTransfer.setData("text/plain", file.name)
          },
        }))}
        selectedFile={selectedFile}
        hoveredFile={hoveredFile}
        hoverPosition={hoverPosition}
        onFileClick={handleFileClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDeleteFile={handleDeleteFile}
        onReupload={handleReupload}
        onManualInput={handleManualInput}
        onSettingsClick={() => setSettingsOpen(true)}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleSidebarClick}
        onClusterButton={handleClusterClick}
      />

      {/* Middle Content Area */}
      <div
        className={`middle-area flex-1 border-r border-gray-200 dark:border-[#454545] p-4 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-1/2' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const fileName = e.dataTransfer.getData("text/plain")
          if (fileName && !timelineItems.includes(fileName)) {
            const file = uploadedFiles.find((f) => f.name === fileName)
            if (file && file.status === "completed") {
              setTimelineItems((prev) => [...prev, fileName])
              if (deletedFromCategories.includes(fileName) || !fileCategories[fileName]) {
                setFileCategories((prev) => ({
                  ...prev,
                  [fileName]: "未分类"
                }))
              }
              setDeletedTimelineItems((prev) => prev.filter(name => name !== fileName))
            }
          }
        }}
      >

        <div className="h-full flex flex-col bg-white dark:bg-[#3A3A3A] rounded-lg shadow-sm">
          <div className="flex-1 overflow-auto relative">
            {isClusterLoading && (
            
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#3A3A3A]/50 z-10">
                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                  <div className="absolute w-1/3 h-full bg-blue-500 rounded-full animate-slide" />
                </div>
              </div>
            )}
            <div className={`h-full transition-opacity duration-300 ${isClusterLoading ? 'opacity-30' : 'opacity-100'}`}>
              {uploadedFiles.length > 0 ? (
                <div className="p-6">
                  {showClusterView ? (
                    <ClusterView
                      files={uploadedFiles.filter(
                        (file) =>
                          file.status === "completed" &&
                          timelineItems.includes(file.name) &&
                          !deletedTimelineItems.includes(file.name)
                      )}
                      fileCategories={fileCategories}
                      selectedFile={selectedFile}
                      onSelectFile={(file) => {
                        setSelectedFile(file)
                        setHoveredFile(null)
                      }}
                      onDeleteTimelineItem={handleDeleteTimelineItem}
                    />
                  ) : (
                    <DocumentTimeline
                      files={uploadedFiles.filter(
                        (file) =>
                          file.status === "completed" &&
                          timelineItems.includes(file.name) &&
                          !deletedTimelineItems.includes(file.name)
                      )}
                      selectedFile={selectedFile}
                      onSelectFile={(file) => {
                        setSelectedFile(file)
                        setHoveredFile(null)
                      }}
                      onDeleteTimelineItem={handleDeleteTimelineItem}
                    />
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {translations.selectPdf}
                  </p>
                </div>
              )}
            </div>
          </div>
          <ContentFooter 
            showClusterButton={showClusterButton}
            onClusterButton={handleClusterClick}
          />
        </div>
      </div>

      {/* Right Content Area */}
      <div className={`hidden md:block p-4 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-1/2' : 'w-1/3'}`}>
        <div className="h-full flex items-center justify-center bg-white dark:bg-[#3A3A3A] rounded-lg shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">{translations.additionalInfo}</p>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

      <Dialog open={manualInputOpen} onOpenChange={setManualInputOpen}>
        <DialogContent className="bg-white dark:bg-[#3A3A3A] dark:border-[#454545]">
          <DialogTitle>{translations.manualInputTitle}</DialogTitle>
          <Textarea
            className="bg-white dark:bg-[#3A3A3A] dark:border-[#454545]"
            value={inputContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputContent(e.target.value)}
            placeholder={translations.manualInputPlaceholder}
          />
          <DialogFooter>
            <Button
              onClick={() => setManualInputOpen(false)}
              className="bg-[#71a3e4] text-white dark:bg-gray-500 dark:text-white"
            >
              {translations.cancel}
            </Button>
            <Button
              onClick={handleSendToBackend}
              className="bg-[#71a3e4] text-white dark:bg-gray-500 dark:text-white"
            >
              {translations.submit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="application/pdf"
        className="hidden"
        multiple
      />
    </main>
  )
}