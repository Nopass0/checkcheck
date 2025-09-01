# 🔧 Исправление проблемы "бесконечная загрузка на сервере"

## 🚨 Симптомы
- Сервер показывает "✅ Ready in XXXms"
- Локально curl работает
- В браузере страница бесконечно загружается

## ⚡ Быстрое решение

```bash
# 1. Остановите все процессы
./stop.sh

# 2. Запустите автоисправление
./fix-server-network.sh
```

## 🔍 Диагностика (если нужна)

```bash
# Проверьте что именно не работает
./debug-network.sh
```

## 🛠️ Ручное исправление

### Шаг 1: Файервол
```bash
# Ubuntu/Debian
sudo ufw allow 6060/tcp
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=6060/tcp
sudo firewall-cmd --reload

# Универсально (iptables)
sudo iptables -I INPUT -p tcp --dport 6060 -j ACCEPT
```

### Шаг 2: Привязка к правильному интерфейсу
```bash
cd frontend
NODE_ENV=production PORT=6060 HOST=0.0.0.0 bun run start
```

### Шаг 3: Проверка
```bash
# Локальный тест
curl http://localhost:6060

# Сетевой тест (замените IP)
curl http://YOUR_SERVER_IP:6060
```

## 🎯 Наиболее частые причины

1. **Файервол блокирует порт 6060**
   - Решение: `sudo ufw allow 6060/tcp`

2. **Next.js слушает только на localhost**
   - Решение: `HOST=0.0.0.0` в команде запуска

3. **Провайдер блокирует порт**
   - Решение: используйте другой порт (8080, 8000)

4. **WebSocket пытается подключиться**
   - Решение: уже исправлено в layout.tsx

## 🔄 Альтернативные порты

Если 6060 не работает, попробуйте:
```bash
# Порт 8080
PORT=8080 HOST=0.0.0.0 bun run start

# Порт 8000  
PORT=8000 HOST=0.0.0.0 bun run start

# Порт 3000
PORT=3000 HOST=0.0.0.0 bun run start
```

## ✅ Проверка успеха

После исправления вы должны увидеть:
- Сервер запустился: `✓ Ready in XXXms`
- Локальный тест: `curl http://localhost:PORT` возвращает HTML
- Сетевой тест: `curl http://SERVER_IP:PORT` возвращает HTML
- Браузер: страница загружается мгновенно

## 🆘 Если ничего не помогает

1. Проверьте логи:
   ```bash
   tail -f server.log
   ```

2. Перезапустите с другим портом:
   ```bash
   PORT=8080 ./fix-server-network.sh
   ```

3. Обратитесь к администратору сервера - возможно проблема в сетевой политике.
