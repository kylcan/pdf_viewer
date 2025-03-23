import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"

interface ContentFooterProps {
  showClusterButton: boolean
  onClusterButton: () => void
  onGenerate: () => void
  isGenerating: boolean
}

export function ContentFooter({ 
  showClusterButton, 
  onClusterButton, 
  onGenerate,
  isGenerating 
}: ContentFooterProps) {
  const { translations } = useSettings()

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex-1">
        {/* 左侧区域预留，如果需要添加其他内容 */}
      </div>
      <div className="w-32"> {/* 固定宽度的容器 */}
        <div className="flex-1 flex justify-end space-x-2"> {/* 使用 flex 和 space-x-2 来排列按钮 */}
          {showClusterButton && (
            <>
              <Button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full bg-[#71a3e4] hover:bg-blue-600 text-white dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                {isGenerating ? 'Generating...' : translations.startGenerating || "开始生成"}
                {/* {translations.startGenerating || "开始生成"} */}
              </Button>
              <Button
                onClick={onClusterButton}
                className="w-full bg-[#71a3e4] hover:bg-blue-600 text-white dark:bg-gray-600 dark:hover:bg-gray-700"
              >
                {translations.cluster || "聚类分析"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 