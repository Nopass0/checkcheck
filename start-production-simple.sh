#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Простой запуск продакшен сервера${NC}"

# Переходим в папку frontend
cd frontend

# Очищаем старые процессы
echo -e "${BLUE}Очистка процессов...${NC}"
lsof -ti:6060 | xargs kill -9 >/dev/null 2>&1

# Всегда пересобираем для продакшена
echo -e "${BLUE}Сборка приложения...${NC}"
rm -rf .next
NODE_ENV=production bun run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка сборки${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Запуск сервера на порту 6060${NC}"
echo -e "${BLUE}Доступ: http://localhost:6060${NC}"
echo -e "${BLUE}Сеть: http://0.0.0.0:6060${NC}"

# Запускаем сервер без интерактивности
NODE_ENV=production PORT=6060 HOST=0.0.0.0 bun run start
