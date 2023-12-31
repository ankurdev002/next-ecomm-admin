import "./globals.css";
import { Inter } from "next/font/google";
import NextAuthSessionProvider from "./providers/sessionProviders";
import Context from "./component/context/Context.";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Panel",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Context>
          <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
        </Context>
      </body>
    </html>
  );
}
