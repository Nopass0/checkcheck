# ⚡ Быстрый запуск CheckCheck

## 🚀 Для продакшена (рекомендуется)

```bash
# 1. Клонируйте и перейдите в папку
git clone <your-repo-url>
cd checkcheck

# 2. Настройте токен (опционально для веба)
cp env.example .env
nano .env  # установите TELEGRAM_TOKEN если нужен бот

# 3. Запустите простой продакшен сервер
./start-production-simple.sh
```

**Готово!** Сайт доступен на http://localhost:6060

## 🛠️ Альтернативные команды

**Полное приложение (бот + веб):**
```bash
./run.sh prod                    # если токен настроен
```

**Только веб (без бота):**
```bash
./run-frontend-only.sh prod      # если проблемы с ботом
```

**Остановка:**
```bash
./stop.sh                        # остановить все
```

## 🌐 Доступ

После запуска сайт будет доступен:
- **Локально**: http://localhost:6060
- **В сети**: http://YOUR_IP:6060
- **Публично**: http://YOUR_PUBLIC_IP:6060

## ✅ Что работает

- ✅ Быстрая загрузка (без зависаний)
- ✅ Генерация PDF через веб-интерфейс  
- ✅ CORS настроен для любых доменов
- ✅ Автоматическое открытие портов
- ✅ Оптимизированная сборка
- ✅ Работает на HTTP без SSL

## 🔧 Если что-то не работает

1. **Порт занят:**
   ```bash
   ./stop.sh && ./start-production-simple.sh
   ```

2. **Проблемы с правами:**
   ```bash
   sudo ./start-production-simple.sh
   ```

3. **Полная переустановка:**
   ```bash
   rm -rf frontend/.next frontend/node_modules .venv
   ./start-production-simple.sh
   ```
