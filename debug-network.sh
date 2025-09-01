#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Диагностика сетевых проблем${NC}"
echo "================================="

echo -e "\n${BLUE}1. Проверка процессов:${NC}"
ps aux | grep -E "(next|bun)" | grep -v grep

echo -e "\n${BLUE}2. Проверка портов:${NC}"
ss -tlnp | grep -E "6060|3000"

echo -e "\n${BLUE}3. Проверка локального подключения:${NC}"
curl -I http://localhost:6060 2>&1 | head -5

echo -e "\n${BLUE}4. Проверка внешнего подключения:${NC}"
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
curl -I http://${LOCAL_IP}:6060 2>&1 | head -5

echo -e "\n${BLUE}5. Проверка файервола UFW:${NC}"
sudo ufw status 2>/dev/null || echo "UFW не установлен"

echo -e "\n${BLUE}6. Проверка iptables:${NC}"
sudo iptables -L INPUT | grep -E "6060|ACCEPT" || echo "Нет правил для 6060"

echo -e "\n${BLUE}7. Проверка сетевых интерфейсов:${NC}"
ip addr show | grep -E "inet " | head -5

echo -e "\n${BLUE}8. Тест подключения с внешнего IP:${NC}"
PUBLIC_IP=$(curl -s -m 5 ifconfig.me 2>/dev/null || echo "недоступен")
if [ "$PUBLIC_IP" != "недоступен" ]; then
    echo "Тестирование с $PUBLIC_IP..."
    timeout 5 curl -I http://${PUBLIC_IP}:6060 2>&1 | head -3 || echo "Подключение не удалось"
else
    echo "Публичный IP недоступен"
fi

echo -e "\n${BLUE}9. Проверка DNS:${NC}"
nslookup localhost 2>/dev/null | head -3 || echo "nslookup недоступен"

echo -e "\n${GREEN}Диагностика завершена${NC}"
