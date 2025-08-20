"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Sparkles, Upload, X } from "lucide-react"
import FloatingPaper from "@/components/floating-paper"
import RoboAnimation from "@/components/robo-animation"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Hero() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative w-full h-full">
          <FloatingPaper x={200} y={100} delay={0} />
          <FloatingPaper x={800} y={200} delay={1} />
          <FloatingPaper x={1200} y={400} delay={2} />
          <FloatingPaper x={400} y={600} delay={3} />
          <FloatingPaper x={1000} y={700} delay={4} />
          <FloatingPaper x={150} y={500} delay={5} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Smarter Course Planning Starts
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-custom-yellow to-orange-500">
              {" "}Here.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            Upload your transcript and let our reccomendation engine reccomend courses personalized to your strenghts and weakenesses.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="bg-custom-yellow hover:bg-custom-yellow/80 text-black font-medium px-8"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FileText className="mr-2 h-5 w-5" />
              Upload Transcript
            </Button>
            <Link href="/results/aboutpage">
              <Button size="lg" variant="outline" className="text-white border-custom-yellow hover:bg-custom-yellow/20">
                <Sparkles className="mr-2 h-5 w-5" />
                How it works
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Robot animation */}
      <RoboAnimation />

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} router={router} />
      )}
    </div>
  )
}

// Upload Modal Component
function UploadModal({ onClose, router }: { onClose: () => void, router: any }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf'
    )
    
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(file => 
      file.type === 'application/pdf'
    )
    
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // Use the first file for now (your Python API processes one file at a time)
      const file = files[0]
      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12000'
      const response = await fetch(`${apiUrl}/upload-pdf`, {
        method: 'POST',
        body: formData,
      })

      console.log('🔍 Response status:', response.status)
      console.log('🔍 Response headers:', response.headers)
      
      const responseText = await response.text()
      console.log('🔍 Raw response:', responseText)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} - ${responseText}`)
      }

      const result = JSON.parse(responseText)
      
      // Transform Python API response to match our frontend expectations
      const analysisResults = {
        filesProcessed: 1,
        totalPages: Math.floor(result.raw_text_length / 2000) || 1, // Estimate pages from text length
        extractedCourses: result.extracted_courses || [],
        recommendations: result.recommendations || [],
        totalCoursesFound: result.total_courses_found || 0,
        totalRecommendations: result.total_recommendations || 0
      }
      
      // Store results in sessionStorage and navigate to results page
      sessionStorage.setItem('analysisResults', JSON.stringify(analysisResults))
      onClose()
      router.push('/results')
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {analysisResults ? 'Analysis Results' : 'Upload Transcript'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isUploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>



        {/* Upload Interface */}
        {(true) && (
          <>
            {/* Error Message */}
            {uploadError && (
              <div className="mb-4 bg-red-900/20 border border-red-700 rounded-lg p-4">
                <p className="text-red-400">{uploadError}</p>
              </div>
            )}

            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-custom-yellow bg-custom-yellow/10' 
                  : 'border-gray-600 hover:border-gray-500'
              } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 text-lg mb-2">
                Drag and drop your PDF transcripts here
              </p>
              <p className="text-gray-500 text-sm mb-4">
                or click the button below to browse files
              </p>
              
              <label className={`inline-flex items-center px-4 py-2 bg-custom-yellow hover:bg-custom-yellow/80 text-black font-medium rounded-lg cursor-pointer transition-colors ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
                <FileText className="w-4 h-4 mr-2" />
                Choose Files
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-medium mb-3">Selected Files:</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-custom-yellow mr-3" />
                        <span className="text-gray-300">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isUploading && (
              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-custom-yellow"></div>
                  <p className="text-gray-300">Analyzing your transcript... This may take a few moments.</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
                className="bg-custom-yellow hover:bg-custom-yellow/80 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Analyzing...' : `Upload ${files.length > 0 ? `(${files.length})` : ''}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
