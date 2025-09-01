#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 Запуск только Frontend CheckCheck${NC}"
echo "======================================="

# Определяем режим запуска
if [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    echo -e "${GREEN}🏭 Режим: ПРОДАКШЕН${NC}"
    MODE="prod"
else
    echo -e "${BLUE}🔧 Режим: РАЗРАБОТКА${NC}"
    MODE="dev"
fi

# Останавливаем старые процессы
echo -e "\n${BLUE}🧹 Очистка старых процессов...${NC}"
pkill -f "next dev\|next start" >/dev/null 2>&1
lsof -ti:6060 | xargs kill -9 >/dev/null 2>&1
echo -e "${GREEN}✅ Старые процессы остановлены${NC}"

# Переходим в папку frontend
cd frontend

echo -e "\n${BLUE}📦 Установка зависимостей Frontend...${NC}"
bun install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки Frontend зависимостей${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend зависимости установлены${NC}"

# Запускаем в зависимости от режима
if [ "$MODE" = "prod" ]; then
    echo -e "\n${BLUE}🏭 Сборка для продакшена...${NC}"
    bun run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка сборки Frontend${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Сборка завершена${NC}"
    
    echo -e "\n${BLUE}🚀 Запуск продакшен сервера...${NC}"
    PORT=6060 bun run start-prod
else
    echo -e "\n${BLUE}🚀 Запуск dev сервера...${NC}"
    PORT=6060 HOST=0.0.0.0 bun run dev-prod
fi
