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
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts"
import Link from "next/link"

export default function IndexingAnalyticsPage() {
  const [indexingStats, setIndexingStats] = useState<{ name: string; value: number }[]>([]);  
  const [isLoading, setIsLoading] = useState(true)
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock data
        const data = [
          { name: "AJOL", value: 35 },
          { name: "DOAJ", value: 25 },
          { name: "Scopus", value: 15 },
          { name: "Web of Science", value: 10 },
          { name: "PubMed", value: 8 },
          { name: "Google Scholar", value: 7 },
        ]

        setIndexingStats(data)
      } catch (error) {
        console.error("Failed to fetch indexing stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDownload = (format: string) => {
    // In a real implementation, this would call an API endpoint to download the stats
    alert(`Downloading indexing stats in ${format} format`)
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
            <h1 className="text-2xl font-bold">Indexing Statistics</h1>
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
            <CardTitle>Percentage of Journals by Indexing</CardTitle>
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
                      <RechartsPieChart>
                        <Pie
                          data={indexingStats}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={200}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {indexingStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip>
                          <ChartTooltipContent />
                        </ChartTooltip>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartLegend>
                    {indexingStats.map((entry, index) => (
                      <ChartLegendItem
                        key={`legend-${index}`}
                        name={entry.name}
                        color={COLORS[index % COLORS.length]}
                      />
                    ))}
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

