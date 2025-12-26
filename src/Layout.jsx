import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { DevModeProvider } from '@/components/DevModeProvider';

export default function Layout({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    setDarkMode(stored !== 'false');
  }, []);

  return (
    <DevModeProvider>
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-[#111]' : 'bg-gray-100'}`}>
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

        /* Light mode overrides */
        html:not(.dark) .bg-\\[\\#111\\] { background-color: #f5f5f5 !important; }
        html:not(.dark) .bg-\\[\\#1a1a1a\\] { background-color: #ffffff !important; }
        html:not(.dark) .bg-\\[\\#222\\] { background-color: #f0f0f0 !important; }
        html:not(.dark) .bg-\\[\\#0a0a0a\\] { background-color: #e5e5e5 !important; }
        html:not(.dark) .text-white { color: #111 !important; }
        html:not(.dark) .text-gray-400 { color: #666 !important; }
        html:not(.dark) .text-gray-500 { color: #888 !important; }
        html:not(.dark) .border-\\[\\#333\\] { border-color: #ddd !important; }
        html:not(.dark) .border-\\[\\#444\\] { border-color: #ccc !important; }
        html:not(.dark) .border-\\[\\#222\\] { border-color: #eee !important; }
      `}</style>
      
      <Header />
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className={`border-t py-6 ${darkMode ? 'bg-[#0a0a0a] border-[#222]' : 'bg-gray-200 border-gray-300'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} MechanicHQ. Find genuine OEM parts instantly.
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-500'}`}>
            Powered by AI • Not affiliated with any vehicle manufacturer
          </p>
        </div>
      </footer>
    </div>
    </DevModeProvider>
  );
}