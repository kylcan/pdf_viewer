import { PdfFile } from "@/types"
import { FileText, X } from "lucide-react"

interface ClusterViewProps {
  files: PdfFile[]
  fileCategories: { [key: string]: string }
  selectedFile: PdfFile | null
  onSelectFile: (file: PdfFile | null) => void
  onDeleteTimelineItem: (fileName: string) => void
  onUpdateCategory: (fileName: string, newCategory: string) => void
  translations: any
}

export function ClusterView({ 
  files, 
  fileCategories, 
  selectedFile, 
  onSelectFile, 
  onDeleteTimelineItem,
  onUpdateCategory,
  translations
}: ClusterViewProps) {
  // 按类别对文件进行分组，并在每个类别内按时间排序
  const groupedFiles = files.reduce((acc, file) => {
    const category = fileCategories[file.name] || "未分类"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(file)
    // 修改为升序排列（旧的在前）
    acc[category].sort((a, b) => {
      const dateA = a.releaseDate?.getTime() || 0
      const dateB = b.releaseDate?.getTime() || 0
      return dateA - dateB // 改为升序
    })
    return acc
  }, {} as { [key: string]: PdfFile[] })

  // 为每个类别定义不同的颜色
  const categoryColors: { [key: string]: string } = {
    "1": "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800",
    "2": "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800",
    "3": "bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800",
    "4": "bg-orange-50 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800",
    "5": "bg-pink-50 border-pink-200 dark:bg-pink-900/30 dark:border-pink-800",
    "未分类": "bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700"
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
        <div 
          key={category} 
          className="space-y-2"
          onDragOver={(e) => {
            e.preventDefault()
            e.currentTarget.classList.add('bg-black/5')
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('bg-black/5')
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.currentTarget.classList.remove('bg-black/5')
            const fileName = e.dataTransfer.getData("text/plain")
            if (fileName && fileCategories[fileName] !== category) {
              onUpdateCategory(fileName, category)
            }
          }}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {translations.category} {category}
          </h3>
          <div className={`rounded-lg border ${categoryColors[category] || "bg-gray-50 border-gray-200"}`}>
            {categoryFiles.map((file, index) => (
              <div
                key={file.name}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", file.name)
                }}
                className={`p-4 cursor-pointer transition-colors duration-200 hover:bg-black/5 ${
                  selectedFile?.name === file.name ? "bg-black/10" : ""
                } ${index !== 0 ? "border-t border-inherit" : ""}`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <div 
                    className="flex-1"
                    onClick={() => onSelectFile(selectedFile?.name === file.name ? null : file)}
                  >
                    <h4 className="text-sm text-gray-900 dark:text-white">
                      {file.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {file.releaseDate?.toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteTimelineItem(file.name)
                    }}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 