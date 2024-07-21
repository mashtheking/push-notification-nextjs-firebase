import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import roboto from "../theme/mui-roboto";
import "./globals.css";

export const metadata: Metadata = {
  title: "NgodingBang Push Notification using Next.js and Firebase",
  description: "Push Notification using Next.js and Firebase",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={roboto}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
