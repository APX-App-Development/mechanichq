import React from 'react';
import Header from '@/components/Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      <style>{`
        :root {
          --primary: #e31e24;
          --primary-dark: #c91a1f;
          --background: #111111;
          --surface: #1a1a1a;
          --border: #333333;
        }
        
        body {
          background-color: #111111;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #444;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        /* PWA status bar color */
        @media (display-mode: standalone) {
          body {
            padding-top: env(safe-area-inset-top);
          }
        }
      `}</style>
      
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-[#222] py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} PartPilot AI. Find genuine OEM parts instantly.
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Powered by Claude AI • Not affiliated with any vehicle manufacturer
          </p>
        </div>
      </footer>
    </div>
  );
}