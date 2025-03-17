"use client"

// Import the motion library at the top
import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Globe2 } from "lucide-react"
import UserAccountNav from "@/components/user-account-nav"


interface HeroProps {
  totalJournals: number
}

export function Hero({ totalJournals }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary px-6 py-24 text-green-400">
      <div className="absolute items-center gap-2 top-0 right-0 m-4">
          <UserAccountNav isLoggedIn={false} />
        </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl text-center"
      >
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
          Discover African Academic Excellence
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
          Access {totalJournals.toLocaleString()} peer-reviewed journals from across Africa, featuring groundbreaking
          research and scholarly articles.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Peer-Reviewed",
              description: "Quality assured academic content",
            },
            {
              icon: GraduationCap,
              title: "Multi-Disciplinary",
              description: "Covering diverse academic fields",
            },
            {
              icon: Globe2,
              title: "Pan-African",
              description: "Research from across the continent",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-lg bg-white/10 p-6 backdrop-blur-sm"
            >
              <feature.icon className="mx-auto mb-4 h-8 w-8" aria-hidden="true" />
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-primary-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

      
      </motion.div>
    </section>
  )
}

