#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Остановка CheckCheck приложения${NC}"
echo "====================================="

echo -e "${YELLOW}Останавливаю Telegram бота...${NC}"
pkill -f "python bot.py" >/dev/null 2>&1 && echo -e "${GREEN}✅ Telegram бот остановлен${NC}" || echo -e "${YELLOW}⚠️  Telegram бот не был запущен${NC}"

echo -e "${YELLOW}Останавливаю Frontend...${NC}"
pkill -f "next dev\|next start" >/dev/null 2>&1 && echo -e "${GREEN}✅ Frontend остановлен${NC}" || echo -e "${YELLOW}⚠️  Frontend не был запущен${NC}"

echo -e "${YELLOW}Освобождаю порты...${NC}"
lsof -ti:6060,3000,3001,3002 | xargs kill -9 >/dev/null 2>&1 && echo -e "${GREEN}✅ Порты освобождены${NC}" || echo -e "${YELLOW}⚠️  Порты уже свободны${NC}"

echo -e "\n${GREEN}🎉 Все процессы остановлены!${NC}"
