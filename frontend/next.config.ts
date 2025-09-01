import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Отключаем ESLint при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Отключаем TypeScript проверки при сборке
  typescript: {
    ignoreBuildErrors: true,
  },

  // Настройки для продакшена
  poweredByHeader: false,
  compress: true,
  
  // Настройки для продакшена (убираем deprecated опции)
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  async headers() {
    return [
      {
        // Применяем CORS ко всем маршрутам
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },
        ],
      },
    ];
  },

  // Настройки сервера для работы на всех интерфейсах
  serverRuntimeConfig: {
    port: process.env.PORT || 6060,
  },
};

export default nextConfig;
