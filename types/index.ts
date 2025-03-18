export interface PdfFile {
  name: string
  size: number
  type: string
  file: File
  progress: number
  status: "uploading" | "processing" | "completed" | "error"
  error?: string
  errorType?: "upload_failed" | "analysis_failed"
  summary?: string
  author?: string
  releaseDate?: Date
}

export interface UploadResponse {
  success: boolean
  message: string
}

export interface AnalysisResponse {
  success: boolean
  summary: string
  author: string
  releaseDate: Date
}

export interface BackendInterface {
  uploadPdf: (file: File, onProgress: (progress: number) => void) => Promise<{ success: boolean; message: string }>
  analyzePdf: (fileName: string) => Promise<AnalysisResponse>
}

