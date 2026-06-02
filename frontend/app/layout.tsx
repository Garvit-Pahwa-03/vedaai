import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/app/components/layout/Sidebar';
import TopBar from '@/app/components/layout/TopBar';
import StoreInitializer from '@/app/components/layout/StoreInitializer';
import BottomNav from '@/app/components/layout/BottomNav';
import AuthInitializer from '@/app/components/layout/AuthInitializer';

export const metadata: Metadata = {
  title: 'VedaAI - AI Assessment Creator',
  description: 'Create and manage AI-powered assignments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthInitializer />
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <div className="flex-1 md:ml-[260px] flex flex-col overflow-hidden">
            <TopBar />
            <StoreInitializer />
            <main
              className="flex-1 overflow-y-auto pb-16 md:pb-0"
              style={{ backgroundColor: '#ebebeb' }}
            >
              {children}
            </main>
          </div>
        </div>

        <div className="block md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}