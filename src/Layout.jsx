import React from 'react';
import Header from '@/components/Header';
import { DevModeProvider } from '@/components/DevModeProvider';

export default function Layout({ children }) {
  return (
    <DevModeProvider>
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-black">
      <style>{`
        :root {
          --primary: #FF6B35;
          --primary-dark: #E85D2A;
          --mechanic-orange: #FF6B35;
          --mechanic-orange-light: #FF8555;
          --mechanic-gray: #666666;
          --mechanic-silver: #999999;
          --mechanic-charcoal: #1a1a1a;
          --mechanic-dark: #000000;
        }

        .dark body, body {
          transition: background-color 0.3s ease;
          background-color: #000000;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444444;
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
      <footer className="border-t py-6 bg-black border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} MechanicHQ. Find genuine OEM parts instantly.
          </p>
          <p className="text-xs mt-1 text-gray-700">
            Powered by AI • Not affiliated with any vehicle manufacturer
          </p>
        </div>
      </footer>
    </div>
    </DevModeProvider>
  );
}