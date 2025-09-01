#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Запуск CheckCheck приложения${NC}"
echo "================================="

# Определяем режим запуска
if [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    MODE="prod"
    PORT=8080
    echo -e "${GREEN}🏭 Режим: ПРОДАКШЕН (порт 8080)${NC}"
else
    MODE="dev"
    PORT=6060
    echo -e "${BLUE}🔧 Режим: РАЗРАБОТКА (порт 6060)${NC}"
fi
echo "================================="

# Функция очистки при выходе
cleanup() {
    echo -e "\n${YELLOW}🛑 Остановка приложений...${NC}"
    if [ ! -z "$BOT_PID" ]; then
        kill $BOT_PID >/dev/null 2>&1
        echo -e "${GREEN}✅ Telegram бот остановлен${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID >/dev/null 2>&1
        echo -e "${GREEN}✅ Frontend остановлен${NC}"
    fi
    exit 0
}

trap cleanup SIGINT SIGTERM

# Настройка переменных окружения
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env не найден, создаю из примера...${NC}"
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${GREEN}✅ Файл .env создан${NC}"
    else
        # Создаем минимальный .env файл
        cat > .env << EOF
# Telegram Bot Token (установите свой токен)
TELEGRAM_TOKEN=your_telegram_bot_token_here

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
EOF
        echo -e "${GREEN}✅ Создан базовый .env файл${NC}"
    fi
fi

# Загружаем переменные окружения
export $(cat .env | grep -v '^#' | xargs)
echo -e "${GREEN}✅ Переменные окружения загружены${NC}"

# Полная очистка старых процессов
echo -e "\n${BLUE}🧹 Очистка старых процессов...${NC}"
pkill -f "python.*bot" >/dev/null 2>&1 || true
pkill -f "next" >/dev/null 2>&1 || true
lsof -ti:$PORT | xargs kill -9 >/dev/null 2>&1 || true
sleep 2
echo -e "${GREEN}✅ Очистка завершена${NC}"

# Открываем порт
echo -e "\n${BLUE}🔓 Открытие порта $PORT...${NC}"
if command -v sudo >/dev/null 2>&1; then
    sudo ufw allow $PORT/tcp >/dev/null 2>&1 || true
    echo -e "${GREEN}✅ Порт открыт${NC}"
else
    echo -e "${YELLOW}⚠️  Нет sudo - пропускаю настройку файервола${NC}"
fi

# Устанавливаем Python зависимости
echo -e "\n${BLUE}📦 Установка Python зависимостей...${NC}"

# Проверяем наличие uv, если нет - устанавливаем
if ! command -v uv >/dev/null 2>&1; then
    echo -e "${YELLOW}📥 Установка uv...${NC}"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi

# Создаем виртуальное окружение
if [ ! -d ".venv" ]; then
    uv venv --python 3.11
fi

# Устанавливаем зависимости с fallback на pip
if ! uv pip install -r requirements.txt >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  uv не сработал, пробую pip...${NC}"
    .venv/bin/pip install -r requirements.txt
fi

echo -e "${GREEN}✅ Python зависимости установлены${NC}"

# Устанавливаем Frontend зависимости
echo -e "\n${BLUE}📦 Установка Frontend зависимостей...${NC}"

# Проверяем наличие bun, если нет - устанавливаем
if ! command -v bun >/dev/null 2>&1; then
    echo -e "${YELLOW}📥 Установка bun...${NC}"
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

cd frontend

# Устанавливаем зависимости с fallback на npm
if ! bun install >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  bun не сработал, пробую npm...${NC}"
    npm install
fi

echo -e "${GREEN}✅ Frontend зависимости установлены${NC}"
cd ..

# Запускаем Telegram бота
echo -e "\n${BLUE}🤖 Запуск Telegram бота...${NC}"
if [ ! -z "$TELEGRAM_TOKEN" ] && [ "$TELEGRAM_TOKEN" != "your_telegram_bot_token_here" ]; then
    (source .venv/bin/activate && python bot.py) > bot.log 2>&1 &
    BOT_PID=$!
    sleep 3
    if kill -0 $BOT_PID 2>/dev/null; then
        echo -e "${GREEN}✅ Telegram бот запущен (PID: $BOT_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  Telegram бот завершился (проверьте bot.log)${NC}"
        BOT_PID=""
    fi
else
    echo -e "${YELLOW}⚠️  TELEGRAM_TOKEN не настроен - бот не запущен${NC}"
    BOT_PID=""
fi

# Запускаем Frontend
echo -e "\n${BLUE}🌐 Запуск Frontend...${NC}"
cd frontend

if [ "$MODE" = "prod" ]; then
    echo -e "${BLUE}🏭 Сборка для продакшена...${NC}"
    NODE_ENV=production bun run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка сборки Frontend${NC}"
        exit 1
    fi
    echo -e "${BLUE}🚀 Запуск продакшен сервера...${NC}"
    NODE_ENV=production PORT=$PORT HOST=0.0.0.0 bun run start > ../frontend.log 2>&1 &
else
    echo -e "${BLUE}🔧 Запуск dev сервера...${NC}"
    PORT=$PORT HOST=0.0.0.0 bun run dev-no-turbo > ../frontend.log 2>&1 &
fi

FRONTEND_PID=$!
cd ..

# Ждем запуска
echo -e "\n${YELLOW}⏳ Ожидание запуска сервисов...${NC}"
sleep 5

# Проверяем статус сервисов
if curl -s http://localhost:$PORT >/dev/null 2>&1; then
    FRONTEND_STATUS="${GREEN}работает${NC}"
else
    FRONTEND_STATUS="${RED}не отвечает${NC}"
fi

# Получаем IP адреса
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
PUBLIC_IP=$(curl -s -m 5 ifconfig.me 2>/dev/null || echo "недоступен")

# Выводим результат
echo -e "\n${GREEN}🎉 Все сервисы запущены!${NC}"
echo "================================================="

# Статус бота
if [ ! -z "$BOT_PID" ] && kill -0 $BOT_PID 2>/dev/null; then
    echo -e "${BLUE}📱 Telegram бот: ${GREEN}работает${NC}"
else
    echo -e "${BLUE}📱 Telegram бот: ${YELLOW}не запущен${NC}"
fi

echo -e "${BLUE}🌐 Веб-приложение: ${FRONTEND_STATUS}${NC}"

echo -e "\n${BLUE}🔗 Доступные ссылки:${NC}"
echo -e "${GREEN}   ✓ Локально:      http://localhost:$PORT${NC}"
echo -e "${GREEN}   ✓ В локальной сети: http://$LOCAL_IP:$PORT${NC}"
if [ "$PUBLIC_IP" != "недоступен" ]; then
    echo -e "${GREEN}   ✓ Публичный доступ: http://$PUBLIC_IP:$PORT${NC}"
fi

echo "================================================="
echo -e "${GREEN}🚀 Для продакшена используйте: http://$LOCAL_IP:$PORT${NC}"
echo -e "${YELLOW}💡 Логи: tail -f bot.log frontend.log${NC}"
echo -e "${YELLOW}💡 Остановка: Ctrl+C или ./stop.sh${NC}"

# Автоматически открыть браузер
if [ -t 1 ] && command -v xdg-open >/dev/null 2>&1; then
    echo -e "\n${BLUE}🌐 Открываю браузер...${NC}"
    xdg-open "http://localhost:$PORT" >/dev/null 2>&1 &
fi

# Ждем завершения процессов
wait