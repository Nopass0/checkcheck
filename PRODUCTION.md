# 🏭 Руководство по продакшену

## 🚀 Быстрый запуск на сервере

```bash
# Клонируйте репозиторий
git clone <your-repo-url>
cd checkcheck

# Настройте токен бота
cp env.example .env
nano .env  # установите TELEGRAM_TOKEN

# Запустите в продакшен режиме
./run.sh prod
```

## 🔧 Что делает продакшен режим

1. **🏗️ Сборка оптимизированного приложения** - полная сборка без dev-зависимостей
2. **🌐 Привязка к 0.0.0.0** - доступ с любого IP-адреса
3. **🔓 Автоматическое открытие портов** в файерволе (UFW/firewalld/iptables)
4. **⚡ Стабильная работа** без hot-reload и dev-инструментов

## 🛠️ Устранение проблем

### 🔄 Бесконечная загрузка страницы

**Причины и решения:**

1. **Порт заблокирован файерволом:**
   ```bash
   # Проверить статус порта
   netstat -tlnp | grep 6060
   
   # Открыть порт вручную (Ubuntu/Debian)
   sudo ufw allow 6060/tcp
   
   # Открыть порт вручную (CentOS/RHEL)
   sudo firewall-cmd --permanent --add-port=6060/tcp
   sudo firewall-cmd --reload
   ```

2. **Проблема с привязкой к интерфейсу:**
   ```bash
   # Проверить, на каком интерфейсе слушает приложение
   ss -tlnp | grep 6060
   
   # Должно показать 0.0.0.0:6060, а не 127.0.0.1:6060
   ```

3. **Проблема с DNS/хостом:**
   ```bash
   # Попробуйте прямой доступ по IP
   curl http://YOUR_SERVER_IP:6060
   
   # Если работает - проблема в DNS/домене
   ```

### 🚫 Не удается подключиться

1. **Проверьте, что сервис запущен:**
   ```bash
   ps aux | grep "next\|bun"
   ```

2. **Проверьте логи:**
   ```bash
   # Запустите в отладочном режиме
   ./run.sh prod 2>&1 | tee debug.log
   ```

3. **Проверьте сетевые настройки:**
   ```bash
   # Проверьте доступность порта
   telnet YOUR_SERVER_IP 6060
   ```

### 🔒 Проблемы с правами

```bash
# Если скрипт не может открыть порты
sudo ./run.sh prod

# Или откройте порты вручную перед запуском
sudo ufw allow 6060/tcp
./run.sh prod
```

## 🌐 Настройка обратного прокси (опционально)

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:6060;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:6060/
    ProxyPassReverse / http://127.0.0.1:6060/
</VirtualHost>
```

## 📊 Мониторинг

### Проверка статуса сервисов

```bash
# Проверить, что приложение отвечает
curl -I http://localhost:6060

# Проверить использование ресурсов
htop
```

### Логи

```bash
# Логи в реальном времени
./run.sh prod 2>&1 | tee -a production.log

# Анализ ошибок
grep -i error production.log
```

## 🔄 Обновление на продакшене

```bash
# Остановить приложение (Ctrl+C)

# Обновить код
git pull origin main

# Перезапустить
./run.sh prod
```

## 🆘 Экстренное восстановление

```bash
# Если что-то пошло не так, сбросить все:
pkill -f "python bot.py"
pkill -f "next"
rm -rf frontend/.next
rm -rf .venv

# Заново запустить
./run.sh prod
```

## 📞 Поддержка

Если проблема не решается:

1. Соберите диагностическую информацию:
   ```bash
   echo "=== System Info ===" > debug-info.txt
   uname -a >> debug-info.txt
   echo "=== Network ===" >> debug-info.txt
   ss -tlnp | grep 6060 >> debug-info.txt
   echo "=== Processes ===" >> debug-info.txt
   ps aux | grep -E "(next|bun|python)" >> debug-info.txt
   echo "=== Firewall ===" >> debug-info.txt
   sudo ufw status >> debug-info.txt 2>&1 || echo "UFW not available" >> debug-info.txt
   ```

2. Создайте Issue в репозитории с файлом `debug-info.txt`
