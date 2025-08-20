"use client"

import { Bot } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function RoboAnimation() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-custom-yellow/20 rounded-full blur-xl"></div>
              <Bot className="w-32 h-32 text-custom-yellow" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute bottom-0 right-0 w-96 h-96">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="absolute -inset-4 bg-custom-yellow/20 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Bot className="w-32 h-32 text-custom-yellow" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
