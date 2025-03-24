import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart";
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface CountryStat {
  country: string;
  count: number;
}

export default function CountriesAnalyticsPage() {
  const [countryStats, setCountryStats] = useState<CountryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch data from the API
        const response = await fetch('https://backend.afrikajournals.org/journal_api/api/journals/country-count/');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setCountryStats(data);
      } catch (error) {
        console.error("Failed to fetch country stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (format: string) => {
    try {
      // Fetch data from the API
      const response = await fetch('https://backend.afrikajournals.org/journal_api/api/journals/country-count/');
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();

      let blob: Blob;
      if (format === "csv") {
        const csvContent = "data:text/csv;charset=utf-8," +
        data.map((e: CountryStat) => `${e.country},${e.count}`).join("\n");        blob = new Blob([csvContent], { type: "text/csv" });
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
      a.download = `country_stats.${format}`;
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
  );
}
