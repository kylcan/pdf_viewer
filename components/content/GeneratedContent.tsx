import { useState } from 'react'
import { Edit2, Copy, Check } from 'lucide-react'

interface GeneratedContentProps {
  content: string
  onContentChange: (newContent: string) => void
}

export function GeneratedContent({ content, onContentChange }: GeneratedContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

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

  return (
    <div className="absolute bottom-4 left-6 right-6 h-[86%] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#3A3A3A] animate-fade-in">
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
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-full p-4 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-[#3A3A3A] dark:text-white resize-none"
        />
      ) : (
        <div className="p-4 text-sm whitespace-pre-wrap dark:text-white overflow-auto h-full">
          {content}
        </div>
      )}
    </div>
  )
} 