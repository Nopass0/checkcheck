#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Запуск на порту 8080 (без sudo)${NC}"

# Переходим в папку frontend
cd frontend

# Очищаем старые процессы
echo -e "${BLUE}Очистка процессов...${NC}"
pkill -f "next" >/dev/null 2>&1
lsof -ti:8080 | xargs kill -9 >/dev/null 2>&1

# Собираем если нужно
if [ ! -d ".next" ]; then
    echo -e "${BLUE}Сборка приложения...${NC}"
    NODE_ENV=production bun run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка сборки${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Запуск сервера на порту 8080${NC}"
echo -e "${BLUE}Доступ: http://localhost:8080${NC}"
echo -e "${BLUE}Сеть: http://0.0.0.0:8080${NC}"

# Получаем IP адреса
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
PUBLIC_IP=$(curl -s -m 5 ifconfig.me 2>/dev/null || echo "недоступен")

echo -e "\n${GREEN}🌐 Сайт будет доступен по адресам:${NC}"
echo -e "${GREEN}   • Локально:    http://localhost:8080${NC}"
echo -e "${GREEN}   • В сети:      http://${LOCAL_IP}:8080${NC}"
if [ "$PUBLIC_IP" != "недоступен" ]; then
    echo -e "${GREEN}   • Публично:    http://${PUBLIC_IP}:8080${NC}"
fi
echo -e "\n${BLUE}Запуск сервера...${NC}"

# Запускаем сервер
NODE_ENV=production PORT=8080 HOST=0.0.0.0 bun run start
