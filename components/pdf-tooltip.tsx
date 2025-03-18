interface PdfTooltipProps {
  summary?: string
  author?: string
}

export function PdfTooltip({ summary, author }: PdfTooltipProps) {
  if (!summary && !author) return null

  return (
    <div className="bg-white dark:bg-[#454545] rounded-lg p-3 shadow-lg max-w-md">
      {author && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          <span className="font-medium">Author:</span> {author}
        </p>
      )}
      {summary && <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>}
    </div>
  )
}

