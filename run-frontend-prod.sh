#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Запуск CheckCheck Frontend (продакшен)${NC}"
echo "=============================================="

# Останавливаем все процессы
echo -e "${BLUE}🧹 Очистка всех процессов...${NC}"
pkill -f "next dev\|next start" >/dev/null 2>&1
lsof -ti:8080,6060 | xargs kill -9 >/dev/null 2>&1
sleep 2

# Открываем порт 8080
echo -e "${BLUE}🔓 Открытие порта 8080...${NC}"
sudo ufw allow 8080/tcp >/dev/null 2>&1 || true

# Переходим в папку frontend
cd frontend

echo -e "\n${BLUE}📦 Установка зависимостей...${NC}"
bun install >/dev/null 2>&1

echo -e "${BLUE}🏗️ Сборка приложения...${NC}"
rm -rf .next
NODE_ENV=production bun run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка сборки${NC}"
    exit 1
fi

# Получаем IP адреса
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
PUBLIC_IP=$(curl -s -m 5 ifconfig.me 2>/dev/null || echo "недоступен")

echo -e "\n${GREEN}✅ Запуск продакшен сервера на порту 8080...${NC}"
echo -e "${BLUE}🌐 Сайт будет доступен по адресам:${NC}"
echo -e "${GREEN}   • Локально:    http://localhost:8080${NC}"
echo -e "${GREEN}   • В сети:      http://${LOCAL_IP}:8080${NC}"
if [ "$PUBLIC_IP" != "недоступен" ]; then
    echo -e "${GREEN}   • Публично:    http://${PUBLIC_IP}:8080${NC}"
fi
echo "=============================================="

# Запускаем сервер
NODE_ENV=production PORT=8080 HOST=0.0.0.0 bun run start
