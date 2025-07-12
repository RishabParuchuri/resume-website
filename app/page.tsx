"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Sparkles, ArrowRight, FileText, X, ExternalLink, Copy, Check } from "lucide-react"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await response.json()

      if (response.ok && data.id) {
        const url = `${window.location.origin}/resume/${data.id}`;
        setWebsiteUrl(url)
        setShowSuccessModal(true)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx"))) {
      setFile(droppedFile)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(websiteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const closeModal = () => {
    setShowSuccessModal(false)
    setFile(null)
    setWebsiteUrl("")
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
              ResumeToSite
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Turn Your Resume Into a
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent block">
              Stunning Website
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and get a beautiful personal website instantly.
          </p>

          {/* Upload Area */}
          <Card className="max-w-2xl mx-auto mb-12 border-2 border-dashed border-slate-700 hover:border-red-500 transition-colors bg-slate-900/50">
            <CardContent className="p-12">
              <div
                className={`relative ${isDragging ? "bg-violet-50" : ""} rounded-lg transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-red-600" />
                  </div>

                  {file ? (
                    <div className="space-y-6">
                      {/* Clean File Display */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-white font-medium">{file.name}</p>
                              <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setFile(null)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-8 py-3 text-lg font-medium w-full rounded-xl"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating Your Website...
                          </>
                        ) : (
                          <>
                            Create My Website
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">Drop your resume here</h3>
                      <p className="text-slate-300">or click to browse files</p>
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <p className="text-sm text-slate-400">Supports PDF and DOCX files</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Website Created!</h2>
              <p className="text-slate-300">Your personal website is ready to view</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-400 mb-1">Your website URL:</p>
                    <p className="text-white font-mono text-sm truncate">{websiteUrl}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="ml-3 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => window.open(websiteUrl, "_blank")}
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl"
                >
                  View Website
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="px-6 border-slate-600 text-slate-300 hover:bg-slate-800 rounded-xl bg-transparent"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
