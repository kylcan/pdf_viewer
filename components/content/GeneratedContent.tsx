import { useState, useRef, useEffect } from 'react'
import { Edit2, Copy, Check } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@/components/ui/context-menu"

interface GeneratedContentProps {
  content: string
  onContentChange: (newContent: string) => void
}

export function GeneratedContent({ content, onContentChange }: GeneratedContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isCopiedMain, setIsCopiedMain] = useState(false)
  const [isCopiedGenerated, setIsCopiedGenerated] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [newGeneratedContent, setNewGeneratedContent] = useState<string | null>(null)
  const [menuStep, setMenuStep] = useState<'initial' | 'loading' | 'generated'>('initial')
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setIsCopiedMain(true)
    setTimeout(() => setIsCopiedMain(false), 2000)
  }

  const handleEdit = () => {
    if (isEditing) {
      onContentChange(editedContent)
    }
    setIsEditing(!isEditing)
  }

  const handleRegenerate = async () => {
    if (!selectedText) return
    setMenuStep('loading')
    setTimeout(() => {
      const simulatedResponse = `重新生成的内容: ${selectedText} (模拟内容)`
      setNewGeneratedContent(simulatedResponse)
      setMenuStep('generated')
    }, 2000)
  }

  const handleReplaceContent = () => {
    if (newGeneratedContent && selectedText) {
      const updatedContent = editedContent.replace(selectedText, newGeneratedContent)
      setEditedContent(updatedContent)
    }
    resetMenu()
  }

  const handleCancel = () => {
    resetMenu()
  }

  const handleCopyGenerated = async () => {
    if (newGeneratedContent) {
      await navigator.clipboard.writeText(newGeneratedContent)
      setIsCopiedGenerated(true)
      setTimeout(() => setIsCopiedGenerated(false), 2000)
    }
  }

  const resetMenu = () => {
    setMenuStep('initial')
    setNewGeneratedContent(null)
    setSelectedText(null)
    setIsCopiedGenerated(false)
    setMenuOpen(false)
  }

  const handleTextSelect = () => {
    const selection = window.getSelection()
    if (selection && selection.toString()) {
      setSelectedText(selection.toString())
    } else {
      setSelectedText(null)
    }
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleTextSelect)
    return () => {
      document.removeEventListener('selectionchange', handleTextSelect)
    }
  }, [])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className="relative bottom-4 left-6 right-6 h-[86%] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#3A3A3A] animate-fade-in"
        >
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isEditing ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Edit2 className="h-4 w-4 text-gray-500" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCopiedMain ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>

          {isEditing ? (
            <textarea
              ref={textAreaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full p-4 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#3A3A3A] dark:text-white resize-none"
            />
          ) : (
            <div className="p-4 text-sm whitespace-pre-wrap dark:text-white overflow-auto h-full">
              {editedContent}
            </div>
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-[300px] rounded-md border border-gray-200 shadow-lg p-3 bg-white dark:bg-[#3A3A3A] text-sm">
        {menuStep === 'initial' && selectedText && (
          <button
            onClick={handleRegenerate}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            重新生成
          </button>
        )}

        {menuStep === 'loading' && (
          <div className="px-3 py-2 text-gray-500 dark:text-gray-300 animate-pulse">生成中...</div>
        )}

        {menuStep === 'generated' && newGeneratedContent && (
          <div className="relative text-gray-800 dark:text-gray-200 whitespace-pre-wrap transition-all animate-fade-in">
            <button
              onClick={handleCopyGenerated}
              className="absolute top-1 right-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white"
              title="复制"
            >
              {isCopiedGenerated ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <div className="pr-6 transition-all duration-500 ease-in-out opacity-100">
              {newGeneratedContent}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={handleCancel}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
              >
                取消
              </button>
              <button
                onClick={handleReplaceContent}
                className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                替换原内容
              </button>
            </div>
          </div>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}