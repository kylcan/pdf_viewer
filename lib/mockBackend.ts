import type { BackendInterface } from "@/types"

const mockBackend: BackendInterface = {
  uploadPdf: (file: File, onProgress: (progress: number) => void) => {
    return new Promise((resolve, reject) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        onProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          if (Math.random() > 0.8) {
            // 20% chance of failure
            reject(new Error("Upload failed"))
          } else {
            resolve({ success: true, message: "Upload completed" })
          }
        }
      }, 500)
    })
  },
  analyzePdf: (fileName: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8) {
          // 20% chance of failure
          reject(new Error("Analysis failed"))
        } else {
          // Generate a random date within the last 5 years
          const currentDate = new Date()
          const randomMonths = Math.floor(Math.random() * 60) // 5 years = 60 months
          const releaseDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - randomMonths,
            Math.floor(Math.random() * 28) + 1, // Random day between 1-28
          )

          resolve({
            success: true,
            summary: `This is a summary of ${fileName}. It contains important information about various topics. The content is extensive and covers multiple areas of interest. This summary provides a brief overview of the key points discussed in the document.`,
            author: "John Doe",
            releaseDate: releaseDate,
          })
        }
      }, 3000)
    })
  },
}

export default mockBackend