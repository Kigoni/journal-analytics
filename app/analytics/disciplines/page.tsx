"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Chart, ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart";
import { Treemap as RechartsTreemap, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface CellProps {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
}

export default function DisciplinesAnalyticsPage() {
  const [disciplineStats, setDisciplineStats] = useState<{ name: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#8DD1E1",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        const data = [
          { name: "Medicine", value: 250 },
          { name: "Agriculture", value: 180 },
          { name: "Social Sciences", value: 150 },
          { name: "Education", value: 120 },
          { name: "Environmental Science", value: 100 },
          { name: "Engineering", value: 80 },
          { name: "Business", value: 70 },
          { name: "Arts & Humanities", value: 60 },
        ];

        setDisciplineStats(data);
      } catch (error) {
        console.error("Failed to fetch discipline stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = (format: string) => {
    // In a real implementation, this would call an API endpoint to download the stats
    alert(`Downloading discipline stats in ${format} format`);
  };

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
            <h1 className="text-2xl font-bold">Disciplines Distribution</h1>
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
            <CardTitle>Distribution of Journals Across Disciplines</CardTitle>
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
                      <RechartsTreemap
                        data={disciplineStats}
                        dataKey="value"
                        nameKey="name"
                        stroke="#fff"
                      >
                        {disciplineStats.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="#fff"
                            strokeWidth={2}
                            render={(cellProps: CellProps) => (
                              <g>
                                <rect
                                  x={cellProps.x}
                                  y={cellProps.y}
                                  width={cellProps.width}
                                  height={cellProps.height}
                                  style={{
                                    fill: COLORS[index % COLORS.length],
                                    stroke: "#fff",
                                    strokeWidth: 2 / (cellProps.depth + 1e-10),
                                    strokeOpacity: 1 / (cellProps.depth + 1e-10),
                                  }}
                                />
                                {cellProps.width > 50 && cellProps.height > 30 && (
                                  <text
                                    x={cellProps.x + cellProps.width / 2}
                                    y={cellProps.y + cellProps.height / 2 + 7}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize={14}
                                  >
                                    {entry.name}
                                  </text>
                                )}
                              </g>
                            )}
                          />
                        ))}
                      </RechartsTreemap>
                    </ResponsiveContainer>
                  </Chart>
                  <ChartLegend>
                    {disciplineStats.map((entry, index) => (
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
  );
}
