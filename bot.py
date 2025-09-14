import logging
import os
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import replace_text

# Пытаемся загрузить dotenv, если доступен
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Получаем токен из переменной окружения или .env файла
TELEGRAM_TOKEN = os.getenv('TELEGRAM_TOKEN', '')

start_text = """Данные следует вводить также, как они должны быть представлены в pdf файле, без пробелов по бокам, каждый блок с новой строки:
1. банк отправителя - альфа, либо т банк
2. Дата и время
3. Сумма перевода, обязательно пробел между сотнямии и тысячами
4. Отправитель - для альфы не указывается
5. Номер телефона
6. Получатель
7. Банк
8. Идентитификатор операции
9. Номер квитации
10. Счет списания

Всего включая банк отправителя 9 строк для альфы, 10 для т банка"""


def normalize_text_t_bank(text):  # приведение текста к единообразному виду
    normalized_text = {}
    normalized_text["date"] = text["date"].strip()
    normalized_text["total"] = text["total"].strip() + " "
    normalized_text["sender"] = text["sender"].strip()
    normalized_text["pfone_number"] = text["pfone_number"].strip()
    normalized_text["recipient"] = text["recipient"].strip()
    normalized_text["bank"] = text["bank"].strip()
    normalized_text["operation_id"] = text["operation_id"].strip()[:-5]
    normalized_text["receipt_number"] = text["receipt_number"].strip()
    normalized_text["card_number"] = text["card_number"].strip()
    normalized_text["operation_id_1"] = text["operation_id"].strip()[-5:]

    return normalized_text


def normalize_text_alfa(text):  # приведение текста к единообразному виду
    normalized_text = {}
    normalized_text["date"] = text["date"].strip()
    normalized_text["total"] = text["total"].strip()
    normalized_text["pfone_number"] = text["pfone_number"].strip()
    normalized_text["recipient"] = text["recipient"].strip()
    normalized_text["bank"] = text["bank"].strip()
    normalized_text["operation_id"] = text["operation_id"]
    normalized_text["receipt_number"] = text["receipt_number"].strip()
    normalized_text["card_number"] = text["card_number"].strip()

    return normalized_text


def generate_file(text):  # создание файла
    rows = text.strip().split("\n")
    print(1111111)

    if len(rows) < 1:
        return {"status": "error", "error": "Неверное количество строк"}

    from_bank = rows[0].lower().strip()

    if from_bank == "т банк":
        if len(rows) != 10:
            return {"status": "error", "error": "Неверное количество строк"}
        new_text = {
            "from_bank":  from_bank,
            "date": rows[1],
            "total": rows[2],
            "sender": rows[3],
            "pfone_number": rows[4],
            "recipient": rows[5],
            "bank": rows[6],
            "operation_id": rows[7],
            "receipt_number": rows[8],
            "card_number": rows[9],
        }
    elif from_bank == "альфа":
        if len(rows) != 9:
            return {"status": "error", "error": "Неверное количество строк"}
        new_text = {
            "from_bank": from_bank,
            "date": rows[1],
            "total": rows[2],
            "pfone_number": rows[3],
            "recipient": rows[4],
            "bank": rows[5],
            "operation_id": rows[6],
            "receipt_number": rows[7],
            "card_number": rows[8],
        }
    else:
        return {"status": "error", "error": "Невернй банк отправителя"}

    try:
        if from_bank == "т банк":
            replace_text.replace_text_t_bank("source_t_bank.pdf", "nf.pdf", normalize_text_t_bank(new_text))
        elif from_bank == "альфа":
            replace_text.replace_text_alfa("source_alfa.pdf", "nf.pdf", normalize_text_alfa(new_text))

    except BaseException as ex:
        print(ex)
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
    # Используем токен из переменной окружения
    if not TELEGRAM_TOKEN:
        raise ValueError("TELEGRAM_TOKEN не найден в переменных окружения")
    application = Application.builder().token(TELEGRAM_TOKEN).build()

    # Добавляем обработчики
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    # Запускаем бота
    application.run_polling()


if __name__ == "__main__":
    main()
