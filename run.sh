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
    echo -e "${GREEN}🏭 Режим: ПРОДАКШЕН${NC}"
    echo -e "${YELLOW}   Использование: ./run.sh prod${NC}"
else
    echo -e "${BLUE}🔧 Режим: РАЗРАБОТКА${NC}"
    echo -e "${YELLOW}   Для продакшена: ./run.sh prod${NC}"
fi
echo "================================="

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Файл .env не найден. Создаем из примера...${NC}"
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "${GREEN}✅ Файл .env создан из env.example${NC}"
        echo -e "${YELLOW}⚠️  Не забудьте установить TELEGRAM_TOKEN в файле .env${NC}"
    else
        echo -e "${RED}❌ Файл env.example не найден${NC}"
        exit 1
    fi
fi

# Загружаем переменные окружения
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Переменные окружения загружены${NC}"
fi

# Проверяем наличие TELEGRAM_TOKEN
if [ -z "$TELEGRAM_TOKEN" ] || [ "$TELEGRAM_TOKEN" = "your_telegram_bot_token_here" ]; then
    echo -e "${RED}❌ TELEGRAM_TOKEN не установлен в файле .env${NC}"
    echo -e "${YELLOW}   Установите токен бота в файле .env и запустите скрипт снова${NC}"
    exit 1
fi

# Проверяем наличие uv
if ! command -v uv &> /dev/null; then
    echo -e "${RED}❌ uv не установлен${NC}"
    echo -e "${YELLOW}   Установите uv: curl -LsSf https://astral.sh/uv/install.sh | sh${NC}"
    exit 1
fi

# Проверяем наличие bun
if ! command -v bun &> /dev/null; then
    echo -e "${RED}❌ bun не установлен${NC}"
    echo -e "${YELLOW}   Установите bun: curl -fsSL https://bun.sh/install | bash${NC}"
    exit 1
fi

# Функция для открытия портов в файерволе
open_firewall_ports() {
    echo -e "${BLUE}🔓 Настройка файервола...${NC}"
    
    # Проверяем, есть ли права sudo
    if command -v sudo >/dev/null 2>&1; then
        # UFW (Ubuntu/Debian)
        if command -v ufw >/dev/null 2>&1; then
            echo -e "${YELLOW}📡 Открываю порт 6060 в UFW...${NC}"
            sudo ufw allow 6060/tcp >/dev/null 2>&1 || echo -e "${YELLOW}⚠️  Не удалось настроить UFW (возможно, уже настроен)${NC}"
        fi
        
        # Firewalld (CentOS/RHEL/Fedora)
        if command -v firewall-cmd >/dev/null 2>&1; then
            echo -e "${YELLOW}📡 Открываю порт 6060 в firewalld...${NC}"
            sudo firewall-cmd --permanent --add-port=6060/tcp >/dev/null 2>&1 || true
            sudo firewall-cmd --reload >/dev/null 2>&1 || true
        fi
        
        # Iptables (универсальный)
        if command -v iptables >/dev/null 2>&1; then
            echo -e "${YELLOW}📡 Настраиваю iptables...${NC}"
            sudo iptables -C INPUT -p tcp --dport 6060 -j ACCEPT >/dev/null 2>&1 || \
            sudo iptables -I INPUT -p tcp --dport 6060 -j ACCEPT >/dev/null 2>&1 || true
        fi
        
        echo -e "${GREEN}✅ Настройка файервола завершена${NC}"
    else
        echo -e "${YELLOW}⚠️  Нет прав sudo - пропускаю настройку файервола${NC}"
        echo -e "${YELLOW}   Убедитесь, что порт 6060 открыт вручную${NC}"
    fi
}

# Проверяем наличие необходимых файлов
if [ ! -f "ishodnik.pdf" ]; then
    echo -e "${RED}❌ Файл ishodnik.pdf не найден${NC}"
    exit 1
fi

if [ ! -f "bot.py" ]; then
    echo -e "${RED}❌ Файл bot.py не найден${NC}"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Папка frontend не найдена${NC}"
    exit 1
fi

# Открываем порты в файерволе
open_firewall_ports

# Функция для остановки процессов при выходе
cleanup() {
    echo -e "\n${YELLOW}🛑 Остановка приложений...${NC}"
    if [ ! -z "$BOT_PID" ]; then
        kill $BOT_PID 2>/dev/null
        echo -e "${GREEN}✅ Telegram бот остановлен${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${GREEN}✅ Frontend остановлен${NC}"
    fi
    exit 0
}

# Ловим сигнал прерывания
trap cleanup SIGINT SIGTERM

echo -e "\n${BLUE}📦 Установка зависимостей Python...${NC}"
# Создаем виртуальное окружение и устанавливаем зависимости из requirements.txt
uv venv --python 3.11
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка создания виртуального окружения${NC}"
    exit 1
fi

uv pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки Python зависимостей${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python зависимости установлены${NC}"

echo -e "\n${BLUE}📦 Установка зависимостей Frontend...${NC}"
cd frontend
bun install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки Frontend зависимостей${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend зависимости установлены${NC}"
cd ..

echo -e "\n${BLUE}🤖 Запуск Telegram бота...${NC}"
source .venv/bin/activate && python bot.py &
BOT_PID=$!
echo -e "${GREEN}✅ Telegram бот запущен (PID: $BOT_PID)${NC}"

echo -e "\n${BLUE}🌐 Запуск Frontend...${NC}"
cd frontend

# Определяем режим запуска
if [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    echo -e "${BLUE}🏭 Режим продакшена - сборка и запуск...${NC}"
    bun run build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка сборки Frontend${NC}"
        exit 1
    fi
    PORT=6060 bun run start-prod &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend собран и запущен в продакшен режиме (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${BLUE}🔧 Режим разработки...${NC}"
    PORT=6060 HOST=0.0.0.0 bun run dev-prod &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend запущен в режиме разработки (PID: $FRONTEND_PID)${NC}"
fi

cd ..

# Ждем запуска сервисов
echo -e "\n${YELLOW}⏳ Ожидание запуска сервисов...${NC}"
sleep 3

# Получаем IP адреса
echo -e "${BLUE}🔍 Определение IP адресов...${NC}"
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || ip route get 1 | awk '{print $7; exit}' 2>/dev/null || echo "localhost")
PUBLIC_IP=$(curl -s -m 5 ifconfig.me 2>/dev/null || curl -s -m 5 ipinfo.io/ip 2>/dev/null || echo "недоступен")

# Проверяем доступность сервиса
check_service() {
    local max_attempts=10
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:6060 >/dev/null 2>&1; then
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    return 1
}

if check_service; then
    SERVICE_STATUS="${GREEN}работает${NC}"
else
    SERVICE_STATUS="${YELLOW}запускается...${NC}"
fi

echo -e "\n${GREEN}🎉 Все сервисы запущены успешно!${NC}"
echo "================================================="
echo -e "${BLUE}📱 Telegram бот: ${GREEN}работает${NC}"
echo -e "${BLUE}🌐 Веб-приложение: ${SERVICE_STATUS}${NC}"
echo -e "\n${BLUE}🔗 Доступные ссылки:${NC}"
echo -e "${GREEN}   ✓ Локально:      ${BLUE}http://localhost:6060${NC}"
echo -e "${GREEN}   ✓ В локальной сети: ${BLUE}http://${LOCAL_IP}:6060${NC}"

if [ "$PUBLIC_IP" != "недоступен" ]; then
    echo -e "${GREEN}   ✓ Публичный доступ: ${BLUE}http://${PUBLIC_IP}:6060${NC}"
    echo -e "${YELLOW}     ⚠️  Убедитесь, что порт 6060 открыт в файерволе${NC}"
else
    echo -e "${YELLOW}   ⚠️  Публичный IP: недоступен${NC}"
fi

echo "================================================="
echo -e "${GREEN}🚀 Для продакшена используйте: ${BLUE}http://${LOCAL_IP}:6060${NC}"
echo -e "${YELLOW}💡 Нажмите Ctrl+C для остановки всех сервисов${NC}"

# Опционально открыть браузер (если запущено в интерактивном режиме)
if [ -t 1 ] && command -v xdg-open >/dev/null 2>&1; then
    echo -e "\n${BLUE}🌐 Открываю браузер...${NC}"
    xdg-open "http://localhost:6060" >/dev/null 2>&1 &
elif [ -t 1 ] && command -v open >/dev/null 2>&1; then
    echo -e "\n${BLUE}🌐 Открываю браузер...${NC}"
    open "http://localhost:6060" >/dev/null 2>&1 &
fi

# Ждем завершения процессов
wait
