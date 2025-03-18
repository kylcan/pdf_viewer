import { useState } from "react"
import type { PdfFile } from "@/types"
import mockBackend from "@/lib/mockBackend"

export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<PdfFile[]>([])

  const uploadFile = async (file: PdfFile) => {
    try {
      await mockBackend.uploadPdf(file.file, (progress) => {
        setUploadedFiles((prev) => prev.map((f) => (f.name === file.name ? { ...f, progress } : f)))
      })

      setUploadedFiles((prev) => prev.map((f) => (f.name === file.name ? { ...f, status: "processing" } : f)))

      const analysis = await mockBackend.analyzePdf(file.name)

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === file.name ? { 
            ...f, 
            status: "completed", 
            summary: analysis.summary, 
            author: analysis.author,
            releaseDate: analysis.releaseDate
          } : f,
        ),
      )
    } catch (error: any) {
      const errorType = error.message?.includes("Upload") ? "upload_failed" : "analysis_failed"
      setUploadedFiles((prev) =>
        prev.map((f) => (f.name === file.name ? { ...f, status: "error", errorType, error: error.message || "Unknown error" } : f)),
      )
    }
  }

  const processFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      if (file.type === "application/pdf" && !uploadedFiles.some((f) => f.name === file.name)) {
        const newFile: PdfFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          progress: 0,
          status: "uploading",
        }
        setUploadedFiles((prev) => [...prev, newFile])
        uploadFile(newFile)
      }
    })
  }

  const handleDeleteFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName))
  }

  const handleReupload = (file: PdfFile) => {
    setUploadedFiles((prev) =>
      prev.map((f) => (f.name === file.name ? { ...f, status: "uploading", progress: 0 } : f))
    )
    uploadFile(file)
  }

  return {
    uploadedFiles,
    processFiles,
    handleDeleteFile,
    handleReupload,
  }
}