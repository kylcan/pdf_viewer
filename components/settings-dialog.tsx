"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSettings } from "@/contexts/settings-context"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, language, setTheme, setLanguage, translations } = useSettings()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-[#3A3A3A] dark:border-[#454545]">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{translations.settings}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="dark:text-white">{translations.language}</Label>
            <RadioGroup
              value={language}
              onValueChange={(value) => setLanguage(value as "en" | "zh")}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="en" className="dark:border-gray-600" />
                <Label htmlFor="en" className="dark:text-gray-300">
                  {translations.english}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zh" id="zh" className="dark:border-gray-600" />
                <Label htmlFor="zh" className="dark:text-gray-300">
                  {translations.chinese}
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label className="dark:text-white">{translations.appearance}</Label>
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as "light" | "dark")}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" className="dark:border-gray-600" />
                <Label htmlFor="light" className="dark:text-gray-300">
                  {translations.light}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" className="dark:border-gray-600" />
                <Label htmlFor="dark" className="dark:text-gray-300">
                  {translations.dark}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

