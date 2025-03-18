import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"

interface ContentFooterProps {
  showClusterButton: boolean
  onClusterButton: () => void
}

export function ContentFooter({ showClusterButton, onClusterButton }: ContentFooterProps) {
  const { translations } = useSettings()

  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex-1">
        {/* 左侧区域预留，如果需要添加其他内容 */}
      </div>
      <div className="w-32"> {/* 固定宽度的容器 */}
        {showClusterButton && (
          <Button
            onClick={onClusterButton}
            className="w-full bg-[#71a3e4] hover:bg-blue-600 text-white dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            {translations.cluster || "聚类分析"}
          </Button>
        )}
      </div>
    </div>
  )
} 