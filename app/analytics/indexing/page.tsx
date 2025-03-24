import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Chart, ChartContainer, ChartLegend, ChartLegendItem, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface IndexingStat {
  name: string;
  value: number;
}

interface Platform {
  platform: string;
}

export default function IndexingAnalyticsPage() {
  const [indexingStats, setIndexingStats] = useState<IndexingStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch platforms from the API
        const response = await fetch('https://backend.afrikajournals.org/journal_api/api/platform/');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data: Platform[] = await response.json();

        // Tally the count for each platform
        const tally: { [key: string]: number } = {};
        data.forEach((item) => {
          if (tally[item.platform]) {
            tally[item.platform]++;
          } else {
            tally[item.platform] = 1;
          }
        });

        // Convert tally to IndexingStat format
        const stats = Object.entries(tally).map(([name, value]) => ({ name, value }));
        setIndexingStats(stats);
      } catch (error) {
        console.error("Failed to fetch indexing stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (format: string) => {
    try {
      // Fetch platforms from the API
      const response = await fetch('https://backend.afrikajournals.org/journal_api/api/platform/');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data: Platform[] = await response.json();

      // Tally the count for each platform
      const tally: { [key: string]: number } = {};
      data.forEach((item) => {
        if (tally[item.platform]) {
          tally[item.platform]++;
        } else {
          tally[item.platform] = 1;
        }
      });

      // Convert tally to IndexingStat format
      const stats = Object.entries(tally).map(([name, value]) => ({ name, value }));

      let blob: Blob;
      if (format === "csv") {
        const csvContent = "data:text/csv;charset=utf-8," +
          stats.map(e => `${e.name},${e.value}`).join("\n");
        blob = new Blob([csvContent], { type: "text/csv" });
      } else if (format === "pdf") {
        // For PDF, you would typically use a library like jsPDF to create the PDF content
        // Here, we'll just simulate the download process
        const pdfContent = "data:application/pdf," + encodeURIComponent("PDF content here");
        blob = new Blob([pdfContent], { type: "application/pdf" });
      } else {
        throw new Error("Unsupported format");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `indexing_stats.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Failed to download stats in ${format} format:`, error);
    }
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
  );
}
