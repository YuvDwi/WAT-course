"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, FileText, Users, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface AnalysisResults {
  filesProcessed: number
  totalPages: number
  extractedCourses: string[]
  recommendations: Array<{
    course_code: string
    score: number
    course_info: {
      url: string
      useful_percentage: number
      easy_percentage: number
      liked_percentage: number
      course_description: string
      reviews: string[]
    }
  }>
  totalCoursesFound: number
  totalRecommendations: number
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<AnalysisResults | null>(null)

  useEffect(() => {
    // Get results from sessionStorage (set during upload)
    const storedResults = sessionStorage.getItem('analysisResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    }
  }, [])

  if (!results) {
    return (
      <div className="min-h-screen bg-black/[0.96] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-yellow mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Upload
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Analysis Results</h1>
                <p className="text-gray-400">Your personalized course recommendations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FileText className="w-4 h-4" />
              <span>{results.filesProcessed} file processed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-medium">Courses Found</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">{results.totalCoursesFound}</p>
            <p className="text-gray-400 text-sm">From your transcript</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="w-6 h-6 text-custom-yellow" />
              <h3 className="text-white font-medium">Recommendations</h3>
            </div>
            <p className="text-3xl font-bold text-custom-yellow">{results.totalRecommendations}</p>
            <p className="text-gray-400 text-sm">Personalized matches</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Award className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-medium">Analysis Status</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">100%</p>
            <p className="text-gray-400 text-sm">Processing complete</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Extracted Courses */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                Courses from Transcript
              </h2>
              {results.extractedCourses && results.extractedCourses.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {results.extractedCourses.map((course, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="bg-gray-800 rounded-lg p-3 flex items-center"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-gray-300 font-mono">{course}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No courses detected in transcript</p>
              )}
            </div>
          </motion.div>

          {/* Recommended Courses */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-custom-yellow" />
                Recommended Courses ({results.totalRecommendations})
              </h2>
              
              {results.recommendations && results.recommendations.length > 0 ? (
                <div className="space-y-6">
                  {results.recommendations.map((rec, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-gray-800 border border-gray-600 rounded-lg p-6 hover:border-custom-yellow/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-custom-yellow mb-1">
                            {rec.course_code}
                          </h3>
                          <p className="text-gray-300 text-lg">{rec.course_info.course_description}</p>
                        </div>
                        <div className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                          {(rec.score * 100).toFixed(1)}% Match
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {rec.course_info.liked_percentage && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400">
                              {rec.course_info.liked_percentage}%
                            </div>
                            <div className="text-xs text-gray-400">Liked</div>
                          </div>
                        )}
                        {rec.course_info.useful_percentage && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400">
                              {rec.course_info.useful_percentage}%
                            </div>
                            <div className="text-xs text-gray-400">Useful</div>
                          </div>
                        )}
                        {rec.course_info.easy_percentage && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-400">
                              {rec.course_info.easy_percentage}%
                            </div>
                            <div className="text-xs text-gray-400">Easy</div>
                          </div>
                        )}
                      </div>

                      {rec.course_info.reviews && rec.course_info.reviews.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Student Reviews
                          </h4>
                          <div className="space-y-2">
                            {rec.course_info.reviews.slice(0, 2).map((review, reviewIndex) => (
                              <p key={reviewIndex} className="text-gray-400 text-sm italic border-l-2 border-gray-600 pl-3">
                                "{review}"
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {rec.course_info.url && (
                        <div className="flex justify-end">
                          <a 
                            href={rec.course_info.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-custom-yellow hover:text-custom-yellow/80 text-sm font-medium transition-colors"
                          >
                            View Course Details
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  No recommendations available. Make sure your transcript contains recognizable course codes.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/">
            <Button size="lg" className="bg-custom-yellow hover:bg-custom-yellow/80 text-black font-medium">
              <FileText className="w-5 h-5 mr-2" />
              Upload Another Transcript
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
