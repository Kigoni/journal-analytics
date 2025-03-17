"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Mic, MicOff, Loader2, Sparkles } from "lucide-react"
import { processVoiceSearch } from "@/lib/ai-api"

interface VoiceSearchProps {
  onSearch: (query: string) => void
}

export default function VoiceSearch({ onSearch }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const startListening = () => {
    setIsListening(true)
    setTranscript("")

    // In a real implementation, this would use the Web Speech API
    // For this demo, we'll simulate recording
    setTimeout(() => {
      setIsListening(false)
      setIsProcessing(true)

      // Simulate processing the audio
      setTimeout(async () => {
        try {
          const result = await processVoiceSearch()
          setTranscript(result.transcript)
          setIsProcessing(false)
        } catch (error) {
          console.error("Error processing voice search:", error)
          setIsProcessing(false)
        }
      }, 2000)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const handleSearch = () => {
    if (transcript) {
      onSearch(transcript)
      setIsDialogOpen(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-10 w-10 bg-white"
        onClick={() => setIsDialogOpen(true)}
        aria-label="Voice Search"
      >
        <Mic className="h-5 w-5 text-purple-600" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Voice Search
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <div className="relative">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  isListening
                    ? "bg-red-100 animate-pulse"
                    : isProcessing
                      ? "bg-yellow-100"
                      : transcript
                        ? "bg-green-100"
                        : "bg-gray-100"
                }`}
              >
                {isListening ? (
                  <Mic className="h-10 w-10 text-red-500" />
                ) : isProcessing ? (
                  <Loader2 className="h-10 w-10 text-yellow-500 animate-spin" />
                ) : transcript ? (
                  <Sparkles className="h-10 w-10 text-green-500" />
                ) : (
                  <Mic className="h-10 w-10 text-gray-400" />
                )}
              </div>
              {isListening && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-3 bg-red-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center space-y-2">
              {isListening ? (
                <p className="text-sm font-medium">Listening...</p>
              ) : isProcessing ? (
                <p className="text-sm font-medium">Processing your query...</p>
              ) : transcript ? (
                <>
                  <p className="text-sm font-medium">I heard:</p>
                  <p className="text-lg font-bold text-purple-700">"{transcript}"</p>
                </>
              ) : (
                <p className="text-sm font-medium">Click the button to start speaking</p>
              )}
            </div>

            {!isProcessing && (
              <Button
                variant={isListening ? "destructive" : "default"}
                className={isListening ? "bg-red-500" : "bg-purple-600"}
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    {transcript ? "Record Again" : "Start Speaking"}
                  </>
                )}
              </Button>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSearch}
              disabled={!transcript || isProcessing || isListening}
              className="bg-purple-600"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

