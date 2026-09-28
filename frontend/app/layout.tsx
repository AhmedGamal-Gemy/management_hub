import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor Ops Dashboard",
  description: "Single-owner command center for a tutoring business.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
