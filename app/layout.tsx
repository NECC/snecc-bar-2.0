import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blogr",
  description: "A fullstack blog starter built with Next.js and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
