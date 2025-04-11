import { useState, useRef } from 'react'
import { Edit2, Copy, Check } from 'lucide-react'
import { useEffect } from 'react'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";

interface GeneratedContentProps {
  content: string
  onContentChange: (newContent: string) => void
}

export function GeneratedContent({ content, onContentChange }: GeneratedContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [contextMenuVisible, setContextMenuVisible] = useState(false)
  const [selectedText, setSelectedText] = useState<string | null>(null)
  const [newGeneratedContent, setNewGeneratedContent] = useState<string | null>(null)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleEdit = () => {
    if (isEditing) {
      onContentChange(editedContent)
    }
    setIsEditing(!isEditing)
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString();
      console.log("Selected Text:", selectedText);
      if (selectedText){
        setSelectedText(selectedText);
        setContextMenuVisible(true);
        setMenuPosition({
          x: e.clientX,
          y: e.clientY
        });
        console.log('Menu Position - X:', e.clientX, 'Y:', e.clientY);
      }
      else{
        setMenuPosition({
          x: 0,
          y: 0
        });
      }
    } else {
      setContextMenuVisible(false);
    }
  };

  const handleRegenerate = async () => {
    if (!selectedText) return
    setIsLoading(true)
  
    // 模拟后端延迟
    setTimeout(() => {
      const simulatedResponse = `重新生成的内容: ${selectedText} (模拟内容)`
      setNewGeneratedContent(simulatedResponse)
      setIsLoading(false)
    }, 2000)
  }

  const handleReplaceContent = () => {
    if (newGeneratedContent) {
      const updatedContent = editedContent.replace(selectedText!, newGeneratedContent)
      setEditedContent(updatedContent)
      setNewGeneratedContent(null)
    }
  }

  const handleCancel = () => {
    setContextMenuVisible(false)
    setIsLoading(false)
    setNewGeneratedContent(null)
  }

  const handleCopyGenerated = async () => {
    if (newGeneratedContent) {
      await navigator.clipboard.writeText(newGeneratedContent)
    }
  }
  
  useEffect(() => {
    const handleClickOutside = () => {
      if (!isLoading && !newGeneratedContent) {
        setContextMenuVisible(false)
      }
    }
  
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isLoading, newGeneratedContent])

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="relative bottom-4 left-6 right-6 h-[86%] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#3A3A3A] animate-fade-in" onContextMenu={handleContextMenu}>
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
              {isCopied ? (
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
              style={{maxWidth: '100%'}}
            />
          ) : (
            <div className="p-4 text-sm whitespace-pre-wrap dark:text-white overflow-auto h-full">
              {content}
            </div>
          )}
        </div>
      </ContextMenuTrigger>

      {menuPosition && (
        <div
          style={{
            position: 'absolute',
            top: `${menuPosition.y + 5}px`,
            left: `${menuPosition.x - 800}px`,
            minWidth: '160px',
            maxWidth: '400px',
          }}
          className="rounded-md border border-gray-200 shadow-sm p-3 z-50 bg-white dark:bg-[#3A3A3A] text-sm"
        >
          {isLoading ? (
            <div className="text-gray-500 dark:text-gray-300 animate-pulse">生成中...</div>
          ) : newGeneratedContent ? (
            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 relative">
              {/* 右上角复制按钮 */}
              <button
                onClick={handleCopyGenerated}
                className="absolute top-1 right-1 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white"
                title="复制"
              >
                <Copy className="w-4 h-4" />
              </button>

              {/* 显示生成内容 */}
              <div className="pr-6">{newGeneratedContent}</div>

              {/* 底部按钮区域 */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={handleCancel}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    handleReplaceContent()
                    setContextMenuVisible(false)
                  }}
                  className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  替换原内容
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleRegenerate}
              className="relative flex cursor-default select-none items-center rounded-md px-4 py-2 text-sm outline-none bg-white text-gray-800 m-[2px] transition-colors duration-200 hover:bg-slate-100"
            >
              <span className="relative z-10">重新生成</span>
            </button>
          )}
        </div>
      )}
    </ContextMenu>
  )
}