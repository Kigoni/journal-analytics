import "@/app/globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeClient from "./ThemeClient"; // Import the new client component

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Afrika Journals - Academic Journal Search & Analytics",
  description: "Discover peer-reviewed African academic journals with AI-enhanced search and analytics",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeClient /> {/* Theme logic handled separately */}
        <ThemeProvider defaultTheme="light">
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
