import { AuthProvider } from "./AuthProvider";
import "./globals.css";
import Navabr from "../components/Navbar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="en">
      <body>
      <Navabr />
        {children}
      </body>
    </html>
    </AuthProvider>
  );
}
