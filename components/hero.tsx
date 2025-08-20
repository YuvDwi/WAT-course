"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Sparkles, Upload, X } from "lucide-react"
import FloatingPaper from "@/components/floating-paper"
import RoboAnimation from "@/components/robo-animation"
import { useState } from "react"

export default function Hero() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

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
            <Button size="lg" variant="outline" className="text-white border-custom-yellow hover:bg-custom-yellow/20">
              <Sparkles className="mr-2 h-5 w-5" />
              How it works
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Robot animation */}
      <RoboAnimation />

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  )
}

// Upload Modal Component
function UploadModal({ onClose }: { onClose: () => void }) {
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
      
      setAnalysisResults(analysisResults)
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

        {/* Analysis Results */}
        {analysisResults && (
          <div className="space-y-6">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <h3 className="text-green-400 font-medium mb-2">Analysis Complete!</h3>
              <p className="text-gray-300">
                Processed {analysisResults.filesProcessed} file(s) with {analysisResults.totalPages} estimated pages.
                Found {analysisResults.totalCoursesFound} courses in your transcript.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Extracted Courses */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Courses Found in Transcript</h4>
                {analysisResults.extractedCourses && analysisResults.extractedCourses.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analysisResults.extractedCourses.map((course: string, index: number) => (
                      <div key={index} className="text-blue-400 flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {course}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No courses detected in transcript</p>
                )}
              </div>

              {/* Recommendation Stats */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">Recommendation Stats</h4>
                <div className="space-y-2">
                  <div className="text-gray-300 flex justify-between">
                    <span>Total Recommendations:</span>
                    <span className="text-custom-yellow">{analysisResults.totalRecommendations}</span>
                  </div>
                  <div className="text-gray-300 flex justify-between">
                    <span>Courses Analyzed:</span>
                    <span className="text-green-400">{analysisResults.totalCoursesFound}</span>
                  </div>
                  <div className="text-gray-300 flex justify-between">
                    <span>Matching Algorithm:</span>
                    <span className="text-blue-400">ML-Powered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Courses */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">
                Recommended Courses ({analysisResults.totalRecommendations})
              </h4>
              {analysisResults.recommendations && analysisResults.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {analysisResults.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="text-custom-yellow font-medium text-lg">{rec.course_code}</h5>
                            <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs">
                              Score: {(rec.score * 100).toFixed(1)}%
                            </span>
                          </div>
                          
                          {rec.course_info && (
                            <div className="space-y-2">
                              {rec.course_info.course_description && (
                                <p className="text-gray-300 text-sm">
                                  {rec.course_info.course_description}
                                </p>
                              )}
                              
                              <div className="flex gap-4 text-xs">
                                {rec.course_info.liked_percentage && (
                                  <span className="text-green-400">
                                    👍 {rec.course_info.liked_percentage}% liked
                                  </span>
                                )}
                                {rec.course_info.useful_percentage && (
                                  <span className="text-blue-400">
                                    💡 {rec.course_info.useful_percentage}% useful
                                  </span>
                                )}
                                {rec.course_info.easy_percentage && (
                                  <span className="text-orange-400">
                                    📚 {rec.course_info.easy_percentage}% easy
                                  </span>
                                )}
                              </div>

                              {rec.course_info.url && (
                                <a 
                                  href={rec.course_info.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-custom-yellow hover:text-custom-yellow/80 text-sm underline"
                                >
                                  View Course Details →
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No recommendations available. Make sure your transcript contains recognizable course codes.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-custom-yellow hover:bg-custom-yellow/80 text-black font-medium"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Upload Interface - shown when no results */}
        {!analysisResults && (
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
