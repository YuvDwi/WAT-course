"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowLeft, Bot, FileText, Brain, Zap, Users, TrendingUp, Award, Database } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">How It Works</h1>
                <p className="text-gray-400">Understanding WATCourse's AI recommendation system</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Bot className="w-4 h-4" />
              <span>AI Powered</span>
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
              <Database className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-medium">Course Database</h3>
            </div>
            <p className="text-3xl font-bold text-blue-400">913</p>
            <p className="text-gray-400 text-sm">University courses</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Brain className="w-6 h-6 text-custom-yellow" />
              <h3 className="text-white font-medium">ML Algorithm</h3>
            </div>
            <p className="text-3xl font-bold text-custom-yellow">384D</p>
            <p className="text-gray-400 text-sm">Vector embeddings</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-medium">Response Time</h3>
            </div>
            <p className="text-3xl font-bold text-green-400">&lt;5s</p>
            <p className="text-gray-400 text-sm">Average analysis</p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* How It Works Steps */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                The Process
              </h2>
              
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h3 className="text-white font-medium mb-1">PDF Text Extraction</h3>
                    <p className="text-gray-400 text-sm">Your transcript is parsed using pdfminer.six to extract course codes and text content.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-custom-yellow text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Course Recognition</h3>
                    <p className="text-gray-400 text-sm">Advanced regex patterns identify course codes from 50+ departments across all faculties.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Vector Similarity</h3>
                    <p className="text-gray-400 text-sm">Pre-computed embeddings enable cosine similarity calculations with scikit-learn.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Smart Filtering</h3>
                    <p className="text-gray-400 text-sm">Balanced scoring: 40% student satisfaction + 30% easiness + 30% usefulness.</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start space-x-4"
                >
                  <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Department Diversity</h3>
                    <p className="text-gray-400 text-sm">Ensures recommendations span different subjects for well-rounded course selection.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Technical Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-custom-yellow" />
                Technical Stack
              </h2>
              
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800 border border-gray-600 rounded-lg p-4"
                >
                  <h3 className="text-white font-medium mb-2">Machine Learning</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• numpy for mathematical operations</li>
                    <li>• scikit-learn for cosine similarity</li>
                    <li>• Pre-computed 384D embeddings</li>
                    <li>• Content-based filtering algorithm</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-800 border border-gray-600 rounded-lg p-4"
                >
                  <h3 className="text-white font-medium mb-2">Backend</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• FastAPI Python web framework</li>
                    <li>• pdfminer.six for PDF text extraction</li>
                    <li>• Advanced regex course detection</li>
                    <li>• Railway cloud deployment</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gray-800 border border-gray-600 rounded-lg p-4"
                >
                  <h3 className="text-white font-medium mb-2">Frontend</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• Next.js React framework</li>
                    <li>• Framer Motion animations</li>
                    <li>• Tailwind CSS styling</li>
                    <li>• Vercel deployment</li>
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gray-800 border border-gray-600 rounded-lg p-4"
                >
                  <h3 className="text-white font-medium mb-2">Data Sources</h3>
                  <ul className="text-gray-400 text-sm space-y-1">
                    <li>• University course catalogs</li>
                    <li>• Student ratings & reviews</li>
                    <li>• Difficulty & usefulness metrics</li>
                    <li>• Course description embeddings</li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Personalized Recommendations?</h3>
            <p className="text-gray-400 mb-6">Upload your transcript and discover courses tailored to your academic journey.</p>
            <Link href="/">
              <Button size="lg" className="bg-custom-yellow hover:bg-custom-yellow/80 text-black font-medium">
                <FileText className="w-5 h-5 mr-2" />
                Try It Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
