import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Отключаем Turbopack для продакшена (стабильнее)
  turbo: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  
  // Настройки для работы на любом хосте
  experimental: {
    allowMiddlewareResponseBody: true,
  },

  // Настройки для продакшена
  output: 'standalone',
  
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
