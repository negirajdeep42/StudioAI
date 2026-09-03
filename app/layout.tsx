import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { StoreProvider } from "@/lib/store-context";
import { ThemeProvider, themeInitScript } from "@/lib/theme-context";

const geistSans = Geist({
  variable: "--font-sans-custom",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI StudyOS - Your AI-powered Study Companion",
  description: "Organize subjects, auto-generate summaries, make plans, track coding stats, and ace interviews.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbfe" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e17" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/*
          Applies the saved theme synchronously during HTML parsing, before the
          first paint, so a dark-mode user never sees a flash of the light UI.
          suppressHydrationWarning above lets React accept the DOM the script wrote.
        */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-purple-100 selection:text-purple-900 dark:selection:bg-purple-500/30 dark:selection:text-purple-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-purple focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <AuthProvider>
            <StoreProvider>{children}</StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
