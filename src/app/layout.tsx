import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import Script from "next/script";
import { TRPCReactProvider } from "~/trpc/react";
import { Menu } from "./Menu";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-slate-900 text-slate-400">
        <Menu />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
      <Script
        crossOrigin="anonymous"
        integrity="sha512-+6Q7hv5pGUBXOuHWw8OdQx3ac7DzM3oJhYqz7SHDku0yl9EBdMqegoPed4GsHRoNF/VQYK2LTYewAIEBrEf/3w=="
        referrerPolicy="no-referrer"
        src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"
        strategy="lazyOnload"
      />
    </html>
  );
}
