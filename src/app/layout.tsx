import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "E-Absen JA",
  description: "Website untuk mencatat kehadiran kajian pagi dan malam",
  icons: {
    icon: "/logo-jagad.png",
    apple: "/logo-jagad.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={poppins.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
