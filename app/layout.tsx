import type { Metadata } from "next";
import { Libre_Franklin, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlassmorphNavbar from "@/components/ui/glassMorphNavigation";
import Footer from "@/components/ui/footer";
import { ThemeProvider } from "@/components/theme-provider";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "work-study-sim",
  description: "Quantify your study sessions in terms of your future income.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${libreFranklin.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
