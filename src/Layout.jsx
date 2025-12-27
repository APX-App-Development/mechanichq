import React from 'react';
import Header from '@/components/Header';
import { DevModeProvider } from '@/components/DevModeProvider';

export default function Layout({ children }) {
  return (
    <DevModeProvider>
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-[#111]">
      <style>{`
        :root {
          --primary: #f97316;
          --primary-dark: #ea580c;
          --mechanic-orange: #f97316;
          --mechanic-orange-light: #fb923c;
          --mechanic-gray: #94a3b8;
          --mechanic-silver: #cbd5e1;
          --mechanic-charcoal: #1e293b;
          --mechanic-dark: #0f172a;
        }
        
        .dark body, body {
          transition: background-color 0.3s ease;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1e293b;
        }
        ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        /* PWA status bar color */
        @media (display-mode: standalone) {
          body {
            padding-top: env(safe-area-inset-top);
          }
        }
      `}</style>
      
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t py-6 bg-[#0a0a0a] border-[#222]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} MechanicHQ. Find genuine OEM parts instantly.
          </p>
          <p className="text-xs mt-1 text-gray-600">
            Powered by AI • Not affiliated with any vehicle manufacturer
          </p>
        </div>
      </footer>
    </div>
    </DevModeProvider>
  );
}