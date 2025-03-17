"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sparkles, TrendingUp, Loader2 } from "lucide-react"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { fetchAITrends } from "@/lib/ai-api"

interface TrendData {
  publicationTrends: { year: number; count: number }[];
  citationTrends: { year: number; count: number }[];
  hotTopics: { name: string; growth: number }[];
  insights: { publications: string; citations: string; topics: string };
}
interface AITrendAnalysisProps {
  query: string;
  thematicArea: string;
}


export default function AITrendAnalysis({ query, thematicArea }: AITrendAnalysisProps) {
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("publications");

  useEffect(() => {
    const loadTrendData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAITrends(query, thematicArea);
        setTrendData(data);
      } catch (error) {
        console.error("Failed to fetch AI trends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendData();
  }, [query, thematicArea]);

  if (!trendData && !isLoading) {
    return null
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Trend Analysis
          {thematicArea && <span className="text-sm font-normal">for {thematicArea}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <>
            <Tabs defaultValue="publications" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="publications">Publications</TabsTrigger>
                <TabsTrigger value="citations">Citations</TabsTrigger>
                <TabsTrigger value="topics">Hot Topics</TabsTrigger>
              </TabsList>

              <TabsContent value="publications" className="space-y-4">
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={trendData?.publicationTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip>
                            <ChartTooltipContent />
                          </ChartTooltip>
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#8884d8"
                            name="Publications"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Publications" color="#8884d8" />
                    </ChartLegend>
                  </ChartContainer>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-700">{trendData?.insights.publications}</span>
                </div>
              </TabsContent>

              <TabsContent value="citations" className="space-y-4">
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={trendData?.citationTrends}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip>
                            <ChartTooltipContent />
                          </ChartTooltip>
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#82ca9d"
                            name="Citations"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Citations" color="#82ca9d" />
                    </ChartLegend>
                  </ChartContainer>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-700">{trendData?.insights.citations}</span>
                </div>
              </TabsContent>

              <TabsContent value="topics" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {trendData?.hotTopics.map((topic, index) => (
                    <Card key={index} className="p-3 bg-white">
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index < 3 ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{topic.name}</h4>
                          <p className="text-xs text-muted-foreground">{topic.growth}% growth in the last year</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-700">{trendData?.insights.topics}</span>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  )
}

