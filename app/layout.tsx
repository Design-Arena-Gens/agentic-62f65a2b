import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Driver Helper',
  description: 'Offline-first assistant for Indian drivers with AI copilot and cloud sync.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-900">
      <body className="min-h-screen">
        <ReactQueryProvider>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
