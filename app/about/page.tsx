import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import { SparklesCore } from "@/components/sparkles"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* Header with results page styling */}
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
            </div>
          </div>
        </div>
      </div>

      {/* Original content with container styling */}
      <div className="container mx-auto px-6 py-8">
        {/* Ambient background with moving particles */}
        <div className="h-full w-full absolute inset-0 z-0">

        </div>

        <div className="relative z-10">
          <Navbar />
          <Hero />
        </div>
      </div>
    </div>
  )
}
