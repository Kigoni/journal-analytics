"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import Link from "next/link"

export default function CountriesAnalyticsPage() {
  const [countryStats, setCountryStats] = useState<{ country: string; count: number }[]>([]);  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock data
        const data = [
          { country: "Nigeria", count: 245 },
          { country: "South Africa", count: 198 },
          { country: "Kenya", count: 156 },
          { country: "Egypt", count: 134 },
          { country: "Ethiopia", count: 89 },
          { country: "Ghana", count: 76 },
          { country: "Tanzania", count: 65 },
          { country: "Uganda", count: 54 },
          { country: "Morocco", count: 48 },
          { country: "Tunisia", count: 42 },
        ]

        setCountryStats(data)
      } catch (error) {
        console.error("Failed to fetch country stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownload = (format: string) => {
    // In a real implementation, this would call an API endpoint to download the stats
    alert(`Downloading country stats in ${format} format`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-r from-yellow-300/20 to-green-300/20">
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Journals by Country</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleDownload("csv")}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Number of Journals per Country</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="h-[600px] w-full">
                <ChartContainer>
                  <Chart>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={countryStats} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="country" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                        <YAxis />
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                        <Bar dataKey="count" fill="#8884d8" name="Number of Journals" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartLegend>
                    <ChartLegendItem name="Number of Journals" color="#8884d8" />
                  </ChartLegend>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

