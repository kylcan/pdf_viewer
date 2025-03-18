import { AlertCircle } from "lucide-react"

interface ErrorIconProps {
  className?: string
}

export function ErrorIcon({ className }: ErrorIconProps) {
  return <AlertCircle className={className} />
}

