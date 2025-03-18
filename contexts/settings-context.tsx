"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type Language = "en" | "zh"

interface SettingsContextType {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  translations: Record<string, string>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [language, setLanguage] = useState<Language>("en")

  const translations = {
    en: {
      settings: "Settings",
      logout: "Logout",
      language: "Language",
      appearance: "Appearance",
      english: "English",
      chinese: "Chinese",
      light: "Light",
      dark: "Dark",
      uploadInstructions: "Click or drag and drop",
      pdfOnly: "PDF files only",
      searchPlaceholder: "Search PDFs...",
      uploadedFiles: "Uploaded Files",
      selectPdf: "Select a PDF to view its content",
      additionalInfo: "Additional information will appear here",
      reupload: "Reupload",
      delete: "Delete",
      manual: "Manual Input",
      cancel: "Cancel",
      submit: "Submit",
      manualInputTitle: "Manual Entry",
      manualInputPlaceholder: "Enter content here...",
      cluster: "Cluster Analysis",
    },
    zh: {
      settings: "设置",
      logout: "注销",
      language: "语言",
      appearance: "外观",
      english: "英文",
      chinese: "中文",
      light: "明亮",
      dark: "深色",
      uploadInstructions: "点击或拖拽上传",
      pdfOnly: "仅支持PDF文件",
      searchPlaceholder: "搜索PDF...",
      uploadedFiles: "已上传文件",
      selectPdf: "选择PDF以查看内容",
      additionalInfo: "附加信息将显示在这里",
      reupload: "重新上传",
      delete: "删除",
      manual: "手动输入",
      cancel: "取消",
      submit: "提交",
      manualEntryTitle: "手动输入",
      manualInputPlaceholder: "此处输入内容",
      cluster: "聚类分析",
    },
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return (
    <SettingsContext.Provider
      value={{
        theme,
        language,
        setTheme,
        setLanguage,
        translations: translations[language],
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

