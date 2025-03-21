import { PdfFile } from "@/types"
import { FileText } from "lucide-react"

interface ClusterViewProps {
  files: PdfFile[]
  fileCategories: { [key: string]: string }
  selectedFile: PdfFile | null
  onSelectFile: (file: PdfFile | null) => void
}

export function ClusterView({ files, fileCategories, selectedFile, onSelectFile }: ClusterViewProps) {
  // 按类别对文件进行分组
  const groupedFiles = files.reduce((acc, file) => {
    const category = fileCategories[file.name] || "未分类"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(file)
    return acc
  }, {} as { [key: string]: PdfFile[] })

  // 为每个类别定义不同的颜色
  const categoryColors: { [key: string]: string } = {
    "1": "bg-blue-100 border-blue-300",
    "2": "bg-green-100 border-green-300",
    "3": "bg-yellow-100 border-yellow-300",
    "未分类": "bg-gray-100 border-gray-300"
  }

  return (
    <div className="p-6 space-y-6">
      {Object.entries(groupedFiles).map(([category, categoryFiles]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Category {category}
          </h3>
          <div className="space-y-2">
            {categoryFiles.map((file) => (
              <div
                key={file.name}
                className={`p-4 rounded-lg border ${
                  categoryColors[category] || "bg-gray-100 border-gray-300"
                } cursor-pointer transition-colors duration-200 hover:bg-opacity-80 ${
                  selectedFile?.name === file.name ? "bg-opacity-50" : ""
                }`}
                onClick={() => onSelectFile(selectedFile?.name === file.name ? null : file)}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {file.releaseDate?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 