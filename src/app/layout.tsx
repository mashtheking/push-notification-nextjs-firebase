import Popup from "@/components/Popup";
import mui from "@/theme/mui";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://push-notification-nextjs-firebase.vercel.app"),
  title: "NgodingBang Push Notification using Next.js and Firebase",
  description: "Create a simple push notification on a web using Next.js and Firebase.",
  applicationName: "NgodingBang Push Notification",
  authors: {
    "name": "Septianata Rizky Pratama",
    "url": "https://github.com/ngodingbang"
  },
  keywords: [
    "Next.js",
    "Push Notification",
    "Firebase Cloud Messaging",
    "Material UI",
    "NgodingBang",
    "Prisma.js",
    "PostgreSQL",
    "Vercel"
  ],
  publisher: "Vercel",
};

export const viewport: Viewport = {
  themeColor: "#4facfe"
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Popup />
          <ThemeProvider theme={mui}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
