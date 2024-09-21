import { PineconeProvider } from '@/context/PineconeContext';
import { RecipeProvider } from '@/context/RecipeContext';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-primary text-gray-300`}>
        <div className="flex flex-col min-h-screen">
          <header className="p-6 h-14 bg-primary sticky top-0 z-50 flex justify-center">
            <div className="container mx-auto flex justify-between items-center">
              <div className="text-xl font-bold text-accent">
                Smart Kitchen
              </div>
              <nav className="space-x-6 text-lg">
                <Link href="/recipe" className="text-sm text-gray-300 hover:text-accent">Home</Link>
                <Link href="/about" className="text-sm text-gray-300 hover:text-accent">About</Link>
                <Link href="/settings" className="text-sm text-gray-300 hover:text-accent">Settings</Link>
              </nav>
            </div>
          </header>
          <main className="flex flex-col flex-grow">
            <PineconeProvider>
              <RecipeProvider>
                {children}
              </RecipeProvider>
            </PineconeProvider>
          </main>
          <footer className="bg-dark-gray text-gray-300 py-6">
            <div className="container mx-auto flex justify-between">
              <div className="text-sm">&copy; 2024 Smart Kitchen, Inc. All rights reserved.</div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}