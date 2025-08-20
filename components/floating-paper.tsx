"use client"

import { FileText } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface FloatingPaperProps {
  x: number
  y: number
  delay?: number
}

export default function FloatingPaper({ x, y, delay = 0 }: FloatingPaperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div
        className="absolute"
        style={{ 
          left: `${x}px`, 
          top: `${y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
          <FileText className="w-8 h-8 text-custom-yellow/50" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="absolute"
      style={{ 
        left: `${x}px`, 
        top: `${y}px`,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: delay * 0.2, 
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      <motion.div
        className="relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform"
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 0.3,
        }}
      >
        <FileText className="w-8 h-8 text-custom-yellow/50" />
      </motion.div>
    </motion.div>
  )
}
