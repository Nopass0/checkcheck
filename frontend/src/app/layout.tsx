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
        {/* Предотвращаем подключение к WebSocket в продакшене */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.__NEXT_DATA__ = window.__NEXT_DATA__ || {};
                window.__NEXT_DATA__.props = window.__NEXT_DATA__.props || {};
                if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
                  // Отключаем WebSocket соединения для hot-reload в продакшене
                  window.WebSocket = function() {
                    return {
                      close: function() {},
                      send: function() {},
                      addEventListener: function() {},
                      removeEventListener: function() {},
                      readyState: 3
                    };
                  };
                }
              `
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}