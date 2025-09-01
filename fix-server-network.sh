#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Исправление сетевых проблем на сервере${NC}"
echo "=============================================="

# Проверяем, есть ли права sudo
if ! command -v sudo >/dev/null 2>&1; then
    echo -e "${RED}❌ sudo не найден. Запустите от root или установите sudo${NC}"
    exit 1
fi

echo -e "\n${BLUE}1. 🔓 Открытие порта 80 в файерволе...${NC}"

# UFW (Ubuntu/Debian)
if command -v ufw >/dev/null 2>&1; then
    echo -e "${YELLOW}Настройка UFW...${NC}"
    sudo ufw allow 80/tcp
    sudo ufw --force enable
    echo -e "${GREEN}✅ UFW настроен${NC}"
fi

# Firewalld (CentOS/RHEL/Fedora)
if command -v firewall-cmd >/dev/null 2>&1; then
    echo -e "${YELLOW}Настройка firewalld...${NC}"
    sudo firewall-cmd --permanent --add-port=80/tcp
    sudo firewall-cmd --reload
    echo -e "${GREEN}✅ Firewalld настроен${NC}"
fi

# Iptables (универсальный)
if command -v iptables >/dev/null 2>&1; then
    echo -e "${YELLOW}Настройка iptables...${NC}"
    # Проверяем, есть ли уже правило
    if ! sudo iptables -C INPUT -p tcp --dport 80 -j ACCEPT >/dev/null 2>&1; then
        sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
        echo -e "${GREEN}✅ Iptables правило добавлено${NC}"
    else
        echo -e "${GREEN}✅ Iptables правило уже существует${NC}"
    fi
    
    # Сохраняем правила (если возможно)
    if command -v iptables-save >/dev/null 2>&1; then
        sudo iptables-save > /etc/iptables/rules.v4 2>/dev/null || true
    fi
fi

echo -e "\n${BLUE}2. 🌐 Проверка сетевой конфигурации...${NC}"

# Получаем IP адреса
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
PUBLIC_IP=$(curl -s -m 5 ifconfig.me 2>/dev/null || curl -s -m 5 ipinfo.io/ip 2>/dev/null || echo "недоступен")

echo -e "${BLUE}Локальный IP: ${GREEN}$LOCAL_IP${NC}"
echo -e "${BLUE}Публичный IP: ${GREEN}$PUBLIC_IP${NC}"

echo -e "\n${BLUE}3. 🔄 Перезапуск сервиса...${NC}"

# Останавливаем старые процессы
pkill -f "next dev\|next start" >/dev/null 2>&1
lsof -ti:80,6060 | xargs kill -9 >/dev/null 2>&1

echo -e "${GREEN}✅ Старые процессы остановлены${NC}"

# Запускаем сервер с правильными настройками
cd frontend

echo -e "${BLUE}Сборка приложения...${NC}"
rm -rf .next
NODE_ENV=production bun run build >/dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Сборка завершена${NC}"
    
    echo -e "${BLUE}Запуск сервера на порту 80...${NC}"
    # Запускаем в фоне с правильными параметрами (порт 80 требует sudo)
    BUN_PATH=$(which bun)
    sudo NODE_ENV=production PORT=80 HOST=0.0.0.0 nohup $BUN_PATH run start > ../server.log 2>&1 &
    SERVER_PID=$!
    
    # Ждем запуска
    sleep 5
    
    # Проверяем, что сервер запустился
    if kill -0 $SERVER_PID 2>/dev/null; then
        echo -e "${GREEN}✅ Сервер запущен (PID: $SERVER_PID)${NC}"
        
        # Тестируем подключение
        echo -e "\n${BLUE}4. 🧪 Тестирование подключений...${NC}"
        
        # Локальный тест
        if curl -s -m 5 http://localhost >/dev/null; then
            echo -e "${GREEN}✅ Локальное подключение: работает${NC}"
        else
            echo -e "${RED}❌ Локальное подключение: не работает${NC}"
        fi
        
        # Сетевой тест
        if curl -s -m 5 http://${LOCAL_IP} >/dev/null; then
            echo -e "${GREEN}✅ Сетевое подключение: работает${NC}"
        else
            echo -e "${RED}❌ Сетевое подключение: не работает${NC}"
        fi
        
        echo -e "\n${GREEN}🎉 Настройка завершена!${NC}"
        echo "=============================================="
        echo -e "${BLUE}📱 Сайт доступен по адресам:${NC}"
        echo -e "${GREEN}   • Локально:    http://localhost${NC}"
        echo -e "${GREEN}   • В сети:      http://${LOCAL_IP}${NC}"
        if [ "$PUBLIC_IP" != "недоступен" ]; then
            echo -e "${GREEN}   • Публично:    http://${PUBLIC_IP}${NC}"
        fi
        echo "=============================================="
        echo -e "${YELLOW}💡 Логи сервера: tail -f server.log${NC}"
        echo -e "${YELLOW}💡 Остановка: pkill -f 'next start'${NC}"
        
    else
        echo -e "${RED}❌ Сервер не запустился${NC}"
        echo -e "${YELLOW}Проверьте логи: cat server.log${NC}"
    fi
else
    echo -e "${RED}❌ Ошибка сборки${NC}"
fi
