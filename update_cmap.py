import decoder


def update_cmap(using_simbols, file, file1):  # обновление cmap таблицы
    stream_num = 7
    cmap_table = b""
    cnt = 1
    for symbol in symbols:
        if symbols.index(symbol) + 1 in using_simbols:
            cmap_table += f"\n<{str(hex(cnt)[2:]).zfill(4)}><{str(hex(cnt)[2:]).zfill(4)}><{hex(ord(symbol))[2:].zfill(4)}>".encode('utf-8')
        cnt += 1

    stream_text = decoder.extract_flate_stream(file, stream_num)

    new_stream_text = stream_text[:241] + cmap_table + stream_text[1533:]

    return decoder.replace_pdf_stream_advanced(file, file1, new_stream_text, stream_num)


symbols = [
    " ", "(", ")", "*", "+", ",", "-", ".", "0", "1",
    "2", "3", "`", "5", "6", "7", "8", "9", ":", "@",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "`",
    "`", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z",
    "Ё", "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И",
    "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "`",
    "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь",
    "Э", "Ю", "Я",
    "а", "б", "в", "г", "д", "е", "ж", "з", "и",
    "й", "к", "л", "м", "н", "о", "п", "р", "с", "т",
    "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь",
    "э", "ю", "я", "ё", "№",  "T", "U", "Т", "4",
]
