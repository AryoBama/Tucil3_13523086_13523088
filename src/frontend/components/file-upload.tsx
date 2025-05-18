"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileLoaded: (content: string) => void;
  text: string;
  setText: (text: string) => void;
}

export function FileUpload({ onFileLoaded, text, setText }: FileUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setText(content)
      onFileLoaded(content)
    }
    reader.readAsText(file)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const handleSubmit = () => {
    onFileLoaded(text)
  }

  // Example input for testing
  const loadExample = () => {
    const exampleInput = 
    `6 6 
11
AAB..F
..BCDF
GPPCDFK
GH.III
GHJ...
LLJMM.`
    setText(exampleInput)
    onFileLoaded(exampleInput)
  }
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()} className="flex-1">
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        <Button variant="secondary" onClick={loadExample} className="flex-1">
          Load Example
        </Button>
      </div>

      <input id="file-upload" type="file" accept=".txt" onChange={handleFileChange} className="hidden" />

      <Textarea
        placeholder="Or paste your puzzle configuration here..."
        value={text}
        onChange={handleTextChange}
        rows={8}
        className="font-mono"
      />

      <Button onClick={handleSubmit} className="w-full">
        Parse Input
      </Button>
    </div>
  )
}
