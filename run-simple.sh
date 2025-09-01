#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Простой запуск CheckCheck${NC}"
echo "==============================="

# Определяем режим
if [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    MODE="prod"
    PORT=8080
    echo -e "${GREEN}🏭 Режим: ПРОДАКШЕН (порт 8080)${NC}"
else
    MODE="dev"
    PORT=6060
    echo -e "${BLUE}🔧 Режим: РАЗРАБОТКА (порт 6060)${NC}"
fi

# Загружаем переменные окружения
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Переменные окружения загружены${NC}"
else
    echo -e "${YELLOW}⚠️  .env не найден, создаю из примера...${NC}"
    cp env.example .env
fi

# Полная очистка
echo -e "\n${BLUE}🧹 Полная очистка процессов...${NC}"
sudo pkill -f "python.*bot" >/dev/null 2>&1 || true
sudo pkill -f "next" >/dev/null 2>&1 || true
sudo pkill -f "bun.*next" >/dev/null 2>&1 || true

# Освобождаем все порты
for port in 80 6060 8080 3000 3001 3002; do
    sudo lsof -ti:$port | xargs kill -9 >/dev/null 2>&1 || true
done

sleep 3
echo -e "${GREEN}✅ Очистка завершена${NC}"

# Открываем нужный порт
echo -e "\n${BLUE}🔓 Открытие порта $PORT...${NC}"
sudo ufw allow $PORT/tcp >/dev/null 2>&1 || true

# Устанавливаем зависимости Python
echo -e "\n${BLUE}📦 Python зависимости...${NC}"
if [ ! -d ".venv" ]; then
    uv venv --python 3.11 >/dev/null 2>&1
fi
uv pip install -r requirements.txt >/dev/null 2>&1
echo -e "${GREEN}✅ Python готов${NC}"

# Устанавливаем зависимости Frontend
echo -e "${BLUE}📦 Frontend зависимости...${NC}"
cd frontend
bun install >/dev/null 2>&1
echo -e "${GREEN}✅ Frontend готов${NC}"

# Запускаем бота (если токен настроен)
cd ..
if [ ! -z "$TELEGRAM_TOKEN" ] && [ "$TELEGRAM_TOKEN" != "your_telegram_bot_token_here" ]; then
    echo -e "\n${BLUE}🤖 Запуск бота...${NC}"
    (source .venv/bin/activate && python bot.py) > bot.log 2>&1 &
    BOT_PID=$!
    sleep 3
    if kill -0 $BOT_PID 2>/dev/null; then
        echo -e "${GREEN}✅ Бот запущен (PID: $BOT_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  Бот завершился (проверьте bot.log)${NC}"
        BOT_PID=""
    fi
else
    echo -e "\n${YELLOW}⚠️  Токен не настроен - бот не запущен${NC}"
    BOT_PID=""
fi

# Запускаем фронтенд
echo -e "\n${BLUE}🌐 Запуск фронтенда...${NC}"
cd frontend

if [ "$MODE" = "prod" ]; then
    echo -e "${BLUE}Сборка для продакшена...${NC}"
    NODE_ENV=production bun run build >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка сборки${NC}"
        exit 1
    fi
    echo -e "${BLUE}Запуск продакшен сервера...${NC}"
    NODE_ENV=production PORT=$PORT HOST=0.0.0.0 bun run start > ../frontend.log 2>&1 &
else
    echo -e "${BLUE}Запуск dev сервера...${NC}"
    PORT=$PORT HOST=0.0.0.0 bun run dev-no-turbo > ../frontend.log 2>&1 &
fi

FRONTEND_PID=$!
cd ..

# Ждем запуска
echo -e "${YELLOW}⏳ Ожидание запуска...${NC}"
sleep 5

# Проверяем статус
if curl -s http://localhost:$PORT >/dev/null 2>&1; then
    FRONTEND_STATUS="${GREEN}работает${NC}"
else
    FRONTEND_STATUS="${RED}не отвечает${NC}"
fi

# Получаем IP адреса
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
PUBLIC_IP=$(curl -s -m 5 ifconfig.me 2>/dev/null || echo "недоступен")

# Выводим результат
echo -e "\n${GREEN}🎉 Запуск завершен!${NC}"
echo "==============================="

if [ ! -z "$BOT_PID" ] && kill -0 $BOT_PID 2>/dev/null; then
    echo -e "${BLUE}📱 Telegram бот: ${GREEN}работает${NC}"
else
    echo -e "${BLUE}📱 Telegram бот: ${YELLOW}не запущен${NC}"
fi

echo -e "${BLUE}🌐 Веб-приложение: ${FRONTEND_STATUS}${NC}"

echo -e "\n${BLUE}🔗 Доступные ссылки:${NC}"
echo -e "${GREEN}   ✓ Локально:    http://localhost:$PORT${NC}"
echo -e "${GREEN}   ✓ В сети:      http://$LOCAL_IP:$PORT${NC}"
if [ "$PUBLIC_IP" != "недоступен" ]; then
    echo -e "${GREEN}   ✓ Публично:    http://$PUBLIC_IP:$PORT${NC}"
fi

echo "==============================="
echo -e "${YELLOW}💡 Логи: tail -f bot.log frontend.log${NC}"
echo -e "${YELLOW}💡 Остановка: ./stop.sh${NC}"

# Функция очистки при выходе
cleanup() {
    echo -e "\n${YELLOW}🛑 Остановка...${NC}"
    if [ ! -z "$BOT_PID" ]; then
        kill $BOT_PID >/dev/null 2>&1
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID >/dev/null 2>&1
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Ждем
wait
