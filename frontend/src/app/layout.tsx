import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CheckCheck - Генератор PDF Квитанций",
  description: "Создайте квитанцию банковского перевода в формате PDF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        {/* Предотвращаем подключение к WebSocket и другие dev-функции */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Отключаем все dev-функции в продакшене
              if (typeof window !== 'undefined') {
                // Отключаем WebSocket для hot-reload
                const OriginalWebSocket = window.WebSocket;
                window.WebSocket = function(url, protocols) {
                  // Блокируем только Next.js WebSocket соединения
                  if (url && (url.includes('_next') || url.includes('webpack'))) {
                    return {
                      close: function() {},
                      send: function() {},
                      addEventListener: function() {},
                      removeEventListener: function() {},
                      readyState: 3,
                      CLOSED: 3
                    };
                  }
                  // Разрешаем другие WebSocket соединения
                  return new OriginalWebSocket(url, protocols);
                };
                
                // Отключаем console.warn для Next.js в продакшене
                const originalWarn = console.warn;
                console.warn = function(...args) {
                  if (args[0] && typeof args[0] === 'string' && 
                      (args[0].includes('Fast Refresh') || 
                       args[0].includes('devIndicators') ||
                       args[0].includes('_next'))) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
                
                // Быстрая загрузка страницы
                window.addEventListener('DOMContentLoaded', function() {
                  document.body.style.visibility = 'visible';
                });
              }
            `
          }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Предотвращаем мерцание при загрузке */
            body { visibility: hidden; }
            .next-dev-overlay-error-body { display: none !important; }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}