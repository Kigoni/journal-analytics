"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download,
  BarChart2,
  PieChart,
  Map,
  LineChart,
  Grid3X3,
} from "lucide-react";
import { fetchJournalStats } from "@/lib/api";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Treemap as RechartsTreemap,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function StatsDialog({
  journal,
  open,
  onOpenChange,
}: {
  journal: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [stats, setStats] = useState<{
    countryStats: { country: string; count: number }[];
    indexingStats: { name: string; value: number }[];
    activityTrends: {
      month: string;
      submissions: number;
      publications: number;
    }[];
    oajGrowth: { year: string; count: number }[];
    disciplineStats: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("country");

  useEffect(() => {
    if (open && journal && typeof journal === 'object') {
  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchJournalStats();
      setStats(data);
    } catch (error) {
      //.error("Failed to fetch journal stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  loadStats();
}
  }, [open, journal]);

  const handleDownload = (format: string) => {
    // In a real implementation, this would call an API endpoint to download the stats
    alert(`Downloading stats in ${format} format`);
  };

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

  if (!journal || !stats) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Journal Statistics: {journal.title}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("csv")}
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("pdf")}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload("json")}
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs
            defaultValue="country"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="country" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Countries</span>
              </TabsTrigger>
              <TabsTrigger value="indexing" className="flex items-center gap-1">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Indexing</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Growth</span>
              </TabsTrigger>
              <TabsTrigger
                value="disciplines"
                className="flex items-center gap-1"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">Disciplines</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="country" className="pt-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Number of Journals per Country
                </h3>
                <div className="h-[400px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={stats.countryStats}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="country"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis />
                          <ChartTooltip>
                            <ChartTooltipContent />
                          </ChartTooltip>
                          <Bar
                            dataKey="count"
                            fill="#8884d8"
                            name="Number of Journals"
                          />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem
                        name="Number of Journals"
                        color="#8884d8"
                      />
                    </ChartLegend>
                  </ChartContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="indexing" className="pt-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Percentage of Journals by Indexing
                </h3>
                <div className="h-[400px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={stats.indexingStats}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {stats.indexingStats.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip>
                            <ChartTooltipContent />
                          </ChartTooltip>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      {stats.indexingStats.map((entry, index) => (
                        <ChartLegendItem
                          key={`legend-${index}`}
                          name={entry.name}
                          color={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </ChartLegend>
                  </ChartContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="pt-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Journal Activity Over Time
                </h3>
                <div className="h-[400px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={stats.activityTrends}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip>
                            <ChartTooltipContent />
                          </ChartTooltip>
                          <Bar
                            dataKey="submissions"
                            fill="#8884d8"
                            name="Submissions"
                          />
                          <Bar
                            dataKey="publications"
                            fill="#82ca9d"
                            name="Publications"
                          />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem name="Submissions" color="#8884d8" />
                      <ChartLegendItem name="Publications" color="#82ca9d" />
                    </ChartLegend>
                  </ChartContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="growth" className="pt-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Growth of Open Access Journals
                </h3>
                <div className="h-[400px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={stats.oajGrowth}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
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
                            name="Open Access Journals"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      <ChartLegendItem
                        name="Open Access Journals"
                        color="#8884d8"
                      />
                    </ChartLegend>
                  </ChartContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="disciplines" className="pt-6">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Distribution of Journals Across Disciplines
                </h3>
                <div className="h-[400px] w-full">
                  <ChartContainer>
                    <Chart>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsTreemap
                          data={stats.disciplineStats}
                          dataKey="value"
                          nameKey="name"
                          ratio={4 / 3}
                          stroke="#fff"
                          //@ts-ignore
                          content={({
                            root,
                            depth,
                            x,
                            y,
                            width,
                            height,
                            index,
                            payload,
                            colors,
                            rank,
                            name,
                          }: any) => {
                            return (
                              <g>
                                <rect
                                  x={x}
                                  y={y}
                                  width={width}
                                  height={height}
                                  style={{
                                    fill: COLORS[index % COLORS.length],
                                    stroke: "#fff",
                                    strokeWidth: 2 / (depth + 1e-10),
                                    strokeOpacity: 1 / (depth + 1e-10),
                                  }}
                                />
                                {width > 50 && height > 30 && (
                                  <text
                                    x={x + width / 2}
                                    y={y + height / 2 + 7}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize={14}
                                  >
                                    {name}
                                  </text>
                                )}
                              </g>
                            ) as React.ReactNode;
                          }}
                        />
                      </ResponsiveContainer>
                    </Chart>
                    <ChartLegend>
                      {stats.disciplineStats.map((entry, index) => (
                        <ChartLegendItem
                          key={`legend-${index}`}
                          name={entry.name}
                          color={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </ChartLegend>
                  </ChartContainer>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}