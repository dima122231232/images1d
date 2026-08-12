import "lenis/dist/lenis.css";
import "./globals.css";

import LenisProvider from "@/components/LenisProvider";
import Header from "@/components/Header/Header";

export const metadata = {
  title: "ImagineCo",
//   description: "MAY 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <LenisProvider>
            {children}
        </LenisProvider>
      </body>
    </html>
  );
}
