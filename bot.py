import logging
import os
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import replace_text

# Загружаем токен из переменной окружения
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "")

start_text = """Данные следует вводить также, как они должны быть представлены в pdf файле, каждый блок с новой строки:
1. Дата и время
2. Сумма перевода, обязательно пробел между сотнямии и тысячами
3. Отправитель
4. Номер телефона
5. Получатель
6. Банк
7. Идентитификатор операции
8. Номер квитации
9. Счет списания

Всего 9 строк"""


def normalize_text(text):  # приведение текста к единообразному виду
    normalized_text = {}
    normalized_text["date"] = text["date"].strip()
    
    # Форматируем сумму с пробелами между тысячами
    total_raw = text["total"].strip().replace(' ', '').replace(',', '.')
    try:
        # Преобразуем в число и форматируем
        total_num = int(float(total_raw))
        total_formatted = f"{total_num:,}".replace(',', ' ') + " "
    except (ValueError, TypeError):
        # Если не удалось преобразовать, оставляем как есть
        total_formatted = text["total"].strip() + " "
    
    normalized_text["total"] = total_formatted
    normalized_text["sender"] = text["sender"].strip()
    normalized_text["pfone_number"] = text["pfone_number"].strip()
    normalized_text["recipient"] = text["recipient"].strip()
    normalized_text["bank"] = text["bank"].strip()
    normalized_text["operation_id"] = text["operation_id"].strip()[:-5]
    normalized_text["receipt_number"] = text["receipt_number"].strip()
    normalized_text["card_number"] = text["card_number"].strip()
    normalized_text["operation_id_1"] = text["operation_id"].strip()[-5:]

    return normalized_text


def generate_file(text: str) -> dict:  # создание файла
    rows = text.strip().split("\n")

    if len(rows) != 9:
        return {"status": "error", "error": "Неверное количество строк"}

    new_text = {
        "date": rows[0],
        "total": rows[1],
        "sender": rows[2],
        "pfone_number": rows[3],
        "recipient": rows[4],
        "bank": rows[5],
        "operation_id": rows[6],
        "receipt_number": rows[7],
        "card_number": rows[8],
    }

    try:
        replace_text.replace_text("ishodnik.pdf", "nf.pdf", normalize_text(new_text))
    except BaseException as ex:
        return {"status": "error", "error": ex}

    return {"status": "success", "path": "nf.pdf"}


# Обработчик команды /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Отправляет сообщение при выполнении команды /start."""

    await update.message.reply_text(start_text)


# Обработчик текстовых сообщений
async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обрабатывает текстовые сообщения и отправляет PDF или сообщение об ошибке."""
    user_text = update.message.text
    result = generate_file(user_text)

    if result["status"] == "success":
        # Отправляем PDF-файл
        await update.message.reply_document(
            document=open(result["path"], 'rb'),
            caption="Ваш PDF-файл готов!"
        )
    else:
        # Отправляем сообщение об ошибке
        await update.message.reply_text(f"Ошибка: {result['error']}")


# Основная функция
def main() -> None:
    """Запускает бота."""
    if not TELEGRAM_TOKEN:
        print("Ошибка: TELEGRAM_TOKEN не установлен в переменных окружения")
        return
    
    application = Application.builder().token(TELEGRAM_TOKEN).build()

    # Добавляем обработчики
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    print("🤖 Telegram бот запускается...")
    
    try:
        # Запускаем бота с обработкой конфликтов
        application.run_polling(
            drop_pending_updates=True,  # Игнорируем старые обновления
            close_loop=False
        )
    except Exception as e:
        if "Conflict" in str(e):
            print("⚠️  Конфликт: другой экземпляр бота уже запущен")
            print("   Остановите другие экземпляры или используйте другой токен")
        else:
            print(f"❌ Ошибка запуска бота: {e}")
        return


if __name__ == "__main__":
    main()
