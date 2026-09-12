import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "Nexus — Your team’s work, clear and connected",
  description:
    "Nexus combines task management, team knowledge, and product planning so everyone knows what matters and what comes next.",
  icons: {
    icon: "/brand/nexus-icon.png",
    apple: "/brand/nexus-icon.png",
  },
  openGraph: {
    title: "Nexus — Your team’s work, clear and connected",
    description:
      "Task management, team knowledge, and product planning in one workspace.",
    siteName: "Nexus",
    type: "website",
    images: [
      {
        url: "/brand/og-iso.png",
        width: 1376,
        height: 768,
        alt: "Nexus — isometric product workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus — Your team’s work, clear and connected",
    description:
      "Task management, team knowledge, and product planning in one workspace.",
    images: ["/brand/og-iso.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth font-sans antialiased",
        fontMono.variable,
        inter.variable
      )}
    >
      <body>
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      </body>
    </html>
  )
}
