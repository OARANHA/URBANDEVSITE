import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "urbanDev - Agentes de IA para Pequenos e Médios Negócios",
  description: "Especialistas em configuração de Agentes de IA para pequenos e médios negócios com assinatura mensal. Automação avançada e inteligência artificial para seu negócio.",
  keywords: ["urbanDev", "Agentes de IA", "Automação", "Inteligência Artificial", "Pequenos negócios", "Médios negócios", "Flowise", "Z.ai"],
  authors: [{ name: "urbanDev Team" }],
  openGraph: {
    title: "urbanDev - Agentes de IA para Negócios",
    description: "Configuração especializada de Agentes de IA para pequenos e médios negócios",
    url: "https://urbandev.com",
    siteName: "urbanDev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "urbanDev - Agentes de IA para Negócios",
    description: "Configuração especializada de Agentes de IA para pequenos e médios negócios",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
