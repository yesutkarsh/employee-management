import { AuthProvider } from "./AuthProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
    </AuthProvider>
  );
}
