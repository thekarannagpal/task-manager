import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Team Task Manager",
  description: "A premium full-stack task manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">
              <Navbar />
              <div className="page-container">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
