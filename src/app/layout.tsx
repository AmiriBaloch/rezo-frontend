import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers"; // ✅ import from the new client component
// import OwnerRouteGuard from "@/components/OwnerRouteGuard"; // Removed

export const metadata: Metadata = {
  title: "Rezo",
  description: "Real-Estate Zone",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* <OwnerRouteGuard> */}
            {children}
          {/* </OwnerRouteGuard> */}
        </Providers>
      </body>
    </html>
  );
}
