import math
import decoder
import update_cmap
import update_xref


def text_to_position(block_text, font_size, end_pos, symbols, index_to_width):  # Рассчет положения текстового блока
    width = 0
    for ch in block_text:
        width += int(index_to_width[str(symbols.index(str(ch)) + 1)])
    print(width / 1000 * font_size, str(round_pos(end_pos - width / 1000 * font_size)).encode("utf-8"), block_text)
    return str(round_pos(end_pos - width / 1000 * font_size)).encode("utf-8")


def round_pos(x):  # округление положения блока
    p = 0
    if x * 1000 % 10 > 5:
        p = 1
    r = (x * 100 + p) // 1 / 100
    if r % 1 == 0:
        r = int(r)
    return r


def replace_text_t_bank(file, file1, new_text):  # Замена текста в файле
    def encode_text(text_to_encode, font_symbols):  # конвертация текста в hex строку по таблице символов
        encoded_text = b""

        for ch in text_to_encode:
            encoded_text += (font_symbols.index(ch) + 1).to_bytes(2, "big")
        return encoded_text
    symbols = [
        " ", "(", ")", "*", "+", ",", "-", ".", "0", "1",
        "2", "3", "four but one", "5", "6", "7", "8", "9", ":", "@",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "not use```",
        "not use 2```", "V", "W", "X", "Y", "Z",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z",
        "Ё", "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И",
        "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "not use 1```",
        "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь",
        "Э", "Ю", "Я",
        "а", "б", "в", "г", "д", "е", "ж", "з", "и",
        "й", "к", "л", "м", "н", "о", "п", "р", "с", "т",
        "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь",
        "э", "ю", "я", "ё", "№", "T", "U", "Т", "4",

    ]

    font_2_symbols = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        "И", "г", "o but 9", "о", "т", "О", " ",
    ]

    end_pos_2_id_font_1 = {5: 243.68, 9: 250, 12: 250, 14: 250, 16: 250, 18: 250, 21: 250, 22: 250}
    end_pos_2_id_font_2 = {1: 237.768}

    font_2_index_to_width = {'1': '570', '2': '509', '3': '516', '4': '523', '5': '571', '6': '509', '7': '534',
                             '8': '492', '9': '542', '10': '534', '11': '675', '12': '390', '13': '544', '14': '544',
                             '15': '418', '16': '544', '17': '200'}
    index_to_width = {'21': '540', '22': '573', '23': '580', '24': '621', '25': '530', '26': '488', '27': '600',
                      '28': '649', '29': '262', '30': '444', '31': '559', '32': '498', '33': '745', '34': '654',
                      '35': '633', '36': '549', '37': '633', '38': '553', '39': '547', '140': '500', '40': '500',
                      '141': '624', '41': '624', '42': '532', '43': '804', '44': '550', '45': '532', '46': '490',
                      '47': '476', '4': '419', '20': '598', '48': '518', '49': '469', '19': '265', '6': '265',
                      '50': '518', '51': '481', '17': '520', '52': '278', '14': '520', '143': '520', '13': '520',
                      '53': '522', '144': '542', '145': '504', '146': '500', '147': '225', '54': '490', '7': '362',
                      '55': '225', '56': '225', '57': '454', '58': '217', '59': '734', '60': '490', '18': '520',
                      '61': '500', '10': '520', '62': '518', '2': '265', '3': '265', '8': '265', '5': '566',
                      '63': '518', '64': '325', '65': '445', '16': '520', '15': '520', '1': '190', '66': '278',
                      '12': '520', '11': '520', '67': '485', '73': '530', '74': '540', '75': '561', '76': '573',
                      '77': '492', '78': '628', '79': '530', '80': '826', '81': '545', '82': '647', '83': '647',
                      '84': '559', '85': '586', '86': '745', '87': '649', '88': '633', '89': '630', '90': '549',
                      '91': '580', '142': '500', '92': '500', '93': '552', '94': '756', '95': '550', '96': '652',
                      '97': '559', '98': '856', '99': '869', '100': '608', '101': '772', '102': '554', '103': '580',
                      '104': '840', '105': '553', '106': '476', '107': '502', '108': '490', '109': '365', '110': '496',
                      '111': '481', '112': '629', '113': '446', '114': '515', '115': '515', '116': '454', '117': '484',
                      '118': '650', '119': '514', '120': '500', '121': '499', '122': '522', '123': '470', '124': '403',
                      '125': '428', '126': '691', '127': '425', '128': '518', '129': '455', '130': '699', '131': '710',
                      '132': '534', '133': '646', '134': '461', '135': '473', '136': '672', '137': '467', '138': '481',
                      '139': '840', '68': '432', '69': '675', '70': '425', '71': '428', '72': '416', '9': '503'}

    positions_font_1 = []
    positions_font_2 = []

    using_ids = []

    font_2_text = [
        "Итого",
        new_text["total"],
    ]

    print(new_text["date"])

    text = [
        new_text["date"],
        "Перевод",
        "По номеру телефона",
        "Статус", "Успешно", new_text["total"],
        "Сумма", "Комиссия", "Без комиссии",
        new_text["sender"], "Отправитель", "Телефон получателя",
        new_text["pfone_number"], "Получатель", new_text["recipient"],
        "Банк получателя", new_text["bank"], "Счет списания",
        new_text["card_number"], "Идентификатор операции", "СБП", new_text["operation_id"],
        new_text["operation_id_1"],
        "Служба поддержки ", "fb@tbank.ru",
        "По вопросам зачисления обращайтесь к получателю",
        f"Квитанция  № {new_text['receipt_number']}",
    ]

    for i in range(len(text)):
        for ch in text[i]:
            using_ids.append(symbols.index(ch) + 1)
        if i in end_pos_2_id_font_1.keys():
            positions_font_1.append(text_to_position(text[i], 9, end_pos_2_id_font_1[i], symbols, index_to_width))
        text[i] = encode_text(text[i], symbols)

    for i in range(len(font_2_text)):
        if i in end_pos_2_id_font_2.keys():
            positions_font_2.append(
                text_to_position(font_2_text[i], 16, end_pos_2_id_font_2[i], font_2_symbols, font_2_index_to_width))
        font_2_text[i] = encode_text(font_2_text[i], font_2_symbols)

    text_stream_text = (
            b"q\nBT\n36 482 Td\nET\nQ\n2 J\nBT\n1 0 0 1 0 518 Tm\n/F1 10 Tf\n()Tj\nET\n"
            b"1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 431.54 Tm\n/F1 8 Tf\n0.56471 0.56471 0.56471 rg\n"
            b"(" + text[0] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\nq 28 0 0 28 121 462 cm /img1 Do Q\nBT\n"
            b"1 0 0 1 121 462 Tm\n28 0 Td\n-28 0 Td\n"
            b"ET\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 19 411.39 Tm\n/F2 16 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + font_2_text[0] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 " + positions_font_2[0] + b" 411.39 Tm\n"
            b"/F2 16 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + font_2_text[1] + b")Tj\n0 g\n/F3 16 Tf\n2 Tr\n0.53333 w\n0.2 0.2 0.2 RG\n0.2 0.2 0.2 rg\n(i)Tj\n"
            b"0 g\n0 Tr\n0 G\n1 w\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 w\n"
            b"0 J\n1 0.86667 0.17647 RG\n[] 0 d\n19 396.5 m\n"
            b"249 396.5 l\nS\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 375.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[1] + b")Tj\n0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n"
            b"2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 172.28 375.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[2] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n"
            b"1 0 0 1 20 355.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[3] + b")Tj\n0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\n"
            b"BT\n1 0 0 1 216.57 355.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n(" + text[4] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n"
            b"1 0 0 1 " + positions_font_1[0] + b" 335.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[5] + b")Tj\n0 g\n/F3 9 Tf\n0.2 0.2 0.2 rg\n(i)Tj\n0 g\nET\n1 0 0 1 0 0 cm\n"
            b"[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 335.78 Tm\n"
            b"/F1 9 Tf\n0.2 0.2 0.2 rg\n(" + text[6] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n"
            b"1 0 0 1 20 315.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[7] + b")Tj\n0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n"
            b"1 0 0 1 0 0 cm\nBT\n1 0 0 1 198.1 315.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[8] + b")Tj\n0 g\nET\n"
            b"1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 " + positions_font_1[1] + b" 295.78 Tm\n/F1 9 Tf\n"
            b"0.2 0.2 0.2 rg\n(" + text[9] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n"
            b"1 0 0 1 20 295.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[10] + b")Tj\n0 g\nET\n1 0 0 1 0 0 cm\n"
            b"[] 0 d\n2 J\n/GS1 gs\n1 1 1 rg\n20 284 230 -108 re\nf\n/GS2 gs\n1 0 0 1 0 0 cm\nBT\n"
            b"1 0 0 1 20 275.78 Tm\n/F1 9 Tf\n"
            b"0.2 0.2 0.2 rg\n(" + text[11] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n"
            b"1 0 0 1 " + positions_font_1[2] + b" 275.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[12] + b")Tj\n0 g\nET\n"
            b"1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 255.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[13] + b")Tj\n0 g\nET\n1 0 0 1 0 0 cm\n"
            b"[] 0 d\n2 J\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 " + positions_font_1[3] + b" 255.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[14] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\n"
            b"BT\n1 0 0 1 20 235.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[15] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n"
            b"1 0 0 1 " + positions_font_1[4] + b" 235.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[16] + b")Tj\n0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n"
            b"1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 215.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[17] + b")Tj\n0 g\nET\n"
            b"1 0 0 1 0 0 cm\n[] 0 d\n2 J\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 " + positions_font_1[5] + b" 215.78 Tm\n"
            b"/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[18] + b")Tj\n0 g\nET\n"
            b"1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 195.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[19] + b")Tj\n0 g\n"
            b"1 0 0 1 20 184.7 Tm\n0.2 0.2 0.2 rg\n(" + text[20] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n[] 0 d\n2 J\n"
            b"1 0 0 1 0 0 cm\nBT\n1 0 0 1 " + positions_font_1[6] + b" 195.78 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[21] + b")Tj\n"
            b"0 g\n1 0 0 1 " + positions_font_1[7] + b" 184.7 Tm\n0.2 0.2 0.2 rg\n(" + text[22] + b")Tj\n0 g\nET\n1 0 0 1 0 0 cm\n[]"
            b" 0 d\n2 J\n"
            b"[] 0 d\n2 J\n[] 0 d\n2 J\n1 w\n0 J\n1 1 1 RG\n[] 0 d\n0 0.5 m\n270 0.5 l\nS\n[] 0 d\n2 J\n"
            b"1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 24.82 Tm\n/F1 9 Tf\n0.56471 0.56471 0.56471 rg\n"
            b"(" + text[23] + b")Tj\n"
            b"0 g\n0.0902 0.44314 0.90196 rg\n(" + text[24] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 41.82 Tm\n"
            b"/F1 9 Tf\n0.56471 0.56471 0.56471 rg\n"
            b"(" + text[25] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\n1 w\n0 J\n1 0.86667 0.17647 RG\n[] 0 d\n20 80.5 m\n"
            b"250 80.5 l\nS\n[] 0 d\n2 J\n"
            b"1 0 0 1 0 0 cm\nBT\n1 0 0 1 20 58.82 Tm\n/F1 9 Tf\n0.2 0.2 0.2 rg\n"
            b"(" + text[26] + b")Tj\n"
            b"0 g\nET\n1 0 0 1 0 0 cm\n[] 0 d\n2 J\nq 175 0 0 63.23 66 103.77 cm /img3 Do Q\nBT\n"
            b"1 0 0 1 66 103.77 Tm\n175 0 Td\n-175 0 Td\n"
            b"ET\n0.25 w\n0 J\n0.76078 0.76078 0.76078 RG\n[] 0 d\n1 1 m\n269 1 l\nS\n[] 0 d\n2 J\n"
    )

    stream_num = 5

    cmap_bias = update_cmap.update_cmap(list(set(using_ids)), file, file1, symbols, 7, "t_bank")
    bias = decoder.replace_pdf_stream_advanced(file1, file1, text_stream_text, stream_num)
    update_xref.update_xref_t_bank(cmap_bias, bias, file1)


def replace_text_alfa(file, file1, new_text):  # Замена текста в файле
    def encode_text(text_to_encode, font_symbols):
        encoded_text = b"<"

        for ch in text_to_encode:
            encoded_text += str(hex(font_symbols.index(ch) + 1)[2:]).zfill(4).upper().encode('utf8')

        encoded_text += b">"
        return encoded_text

    symbols = [
        " ", "(", ")", "*", "+", ",", "-", ".", "0", "1",
        "2", "3", "four but one", "5", "6", "7", "8", "9", ":", "@",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
        "K", "L", "M", "N", "O", "P", "Q", "R", "S", "not use```",
        "not use 2```", "V", "W", "X", "Y", "Z",
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z", "`", "`",
        "Ё", "А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И",
        "Й", "К", "Л", "М", "Н", "О", "П", "not use 1```", "С", "Т",
        "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ы", "Ь",
        "Э", "Ю", "Я",
        "а", "б", "в", "г", "д", "е", "ж", "з", "и",
        "й", "к", "л", "м", "н", "о", "п", "р", "с", "т",
        "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы", "ь",
        "э", "ю", "я", "ё", "№", "T", "U", "Р", "4",

    ]

    using_ids = []

    print(new_text["date"])

    # Получаем сообщение или используем значение по умолчанию
    message = new_text.get("message", "Перевод денежных средств")

    text = [
        "Сформирована", " ",
        f"{new_text['date'][:-3]} мск",
        " ", "Квитанция о переводе по СБП ",
        " ", "Сумма перевода", " ", f"{new_text['total']} RUR ", "Комиссия", " ",
        "0 RUR ", "Дата и время перевода", " ", f"{new_text['date']} мск ",
        "Номер операции", " ", f"{new_text['receipt_number']} ", "Получатель", " ",
        f"{new_text['recipient']} ", " ", " ", "Номер телефона получателя", " ",
        new_text["pfone_number"], "Банк получателя", " ", new_text["bank"],
        "Счёт списания", " ", new_text["card_number"], "Идентификатор операции в СБП", " ",
        new_text["operation_id"],
        "Сообщение получателю", " ",
        message
    ]

    for i in range(len(text)):
        for ch in text[i]:
            using_ids.append(symbols.index(ch) + 1)
        text[i] = encode_text(text[i], symbols)

    text_stream_text = (
            b"q 297 0 0 35 262.85 35.45 cm /Im0 Do Q\r\nq 30 0 0 46 35.45 760.45 cm /Im1 Do Q\r\n"
            b".494 .494 .513 RG .494 .494 .513 rg\r\nBT\r\n1 0 0 1 484.048 795.444 Tm\r\n/F1\r\n"
            b" 11 Tf\r\n" + text[0] + b" Tj\r\n0 0 0 RG 0 0 0 rg\r\n"
                                      b"1 0 0 1 559.069 790.672 Tm\r\n/F1\r\n 2.5 Tf\r\n" + text[
                1] + b" Tj\r\n.494 .494 .513 RG .494 .494 .513 rg\r\n"
                     b"1 0 0 1 452.788 779.15 Tm\r\n/F1\r\n 11 Tf\r\n" + text[2] + b" Tj\r\n"
                                                                                   b"0 0 0 RG 0 0 0 rg\r\n1 0 0 1 35.45 732.437 Tm\r\n/F1\r\n 28 Tf\r\n" +
            text[3] + b" Tj\r\n"
                      b"1 0 0 1 35.45 715.783 Tm\r\n/F1\r\n 21 Tf\r\n" + text[4] + b""
                                                                                   b" Tj\r\n1 0 0 1 35.45 690.436 Tm\r\n" +
            text[5] + b" Tj\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n"
                      b"1 0 0 1 35.45 682.698 Tm\r\n/F1\r\n 11 Tf\r\n" + text[6] +
            b" Tj\r\n0 0 0 RG 0 0 0 rg\r\n1 0 0 1 35.45 677.926 Tm\r\n/F1\r\n 2.5 Tf\r\n" + text[7] + b" Tj\r\nET\r\n"
                                                                                                      b"q 35.45 661.81 255.1 15.6 re W n\r\nBT\r\n1 0 0 1 35.45 664.288 Tm\r\n/F1\r\n 12 Tf\r\n" +
            text[8] +
            b" Tj\r\nET\r\nQ\r\n0 0 0 RG\r\n0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n"
            b"1 0 0 1 35.45 639.804 Tm\r\n/F1\r\n 11 Tf\r\n" + text[9] + b" Tj\r\n0 0 0 RG 0 0 0 rg\r\n"
                                                                         b"1 0 0 1 35.45 635.032 Tm\r\n/F1\r\n 2.5 Tf\r\n" +
            text[10] + b" Tj\r\n"
                       b"ET\r\nq 35.45 618.916 255.1 15.6 re W n\r\nBT\r\n"
                       b"1 0 0 1 35.45 621.394 Tm\r\n/F1\r\n 12 Tf\r\n" + text[11] + b" Tj\r\nET\r\nQ\r\n0 0 0 RG\r\n"
                                                                                     b"0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n1 0 0 1 35.45 596.91 Tm\r\n/F1\r\n"
                                                                                     b" 11 Tf\r\n" + text[
                12] + b" Tj\r\n"
                      b"0 0 0 RG 0 0 0 rg\r\n1 0 0 1 35.45 592.138 Tm\r\n/F1\r\n 2.5 Tf\r\n" + text[
                13] + b" Tj\r\nET\r\n"
                      b"q 35.45 576.022 255.1 15.6 re W n\r\nBT\r\n1 0 0 1 35.45 578.5 Tm\r\n/F1\r\n 12 Tf\r\n"
            + text[14] + b" Tj\r\n"
                         b"ET\r\nQ\r\n0 0 0 RG\r\n0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n"
                         b"1 0 0 1 35.45 554.016 Tm\r\n/F1\r\n 11 Tf\r\n" + text[15] + b" Tj\r\n"
                                                                                       b"0 0 0 RG 0 0 0 rg\r\n1 0 0 1 35.45 549.244 Tm\r\n/F1\r\n 2.5 Tf\r\n" +
            text[16] + b" Tj\r\nET\r\n"
                       b"q 35.45 533.128 255.1 15.6 re W n\r\nBT\r\n1 0 0 1 35.45 535.606 Tm\r\n/F1\r\n 12 Tf\r\n"
                       b"" + text[17] + b" Tj\r\nET\r\nQ\r\n0 0 0 RG\r\n"
                                        b"0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n1 0 0 1 35.45 511.122 Tm\r\n/F1\r\n"
                                        b" 11 Tf\r\n" + text[
                18] + b" Tj\r\n0 0 0 RG 0 0 0 rg\r\n1 0 0 1 35.45 506.35 Tm\r\n"
                      b"/F1\r\n 2.5 Tf\r\n" + text[19] + b" Tj\r\nET\r\nq 35.45 490.234 255.1 15.6 re W n\r\n"
                                                         b"BT\r\n1 0 0 1 35.45 492.712 Tm\r\n"
                                                         b"/F1\r\n 12 Tf\r\n" + text[20] + b" Tj\r\nET\r\n"
                                                                                           b"Q\r\n0 0 0 RG\r\n0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n1 0 0 1 35.45 451.221 Tm\r\n"
                                                                                           b"/F1\r\n 28 Tf\r\n" + text[
                21] + b" Tj\r\n"
                      b"ET\r\nq 201 0 0 85.09 35.45 370.487 cm /Im2 Do Q\r\nBT\r\n1 0 0 1 35.45 367.986 Tm\r\n/F1\r\n 2.5 Tf\r\n"
            + text[22] + b" Tj\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n1 0 0 1 304.75 682.698 Tm\r\n/F1\r\n 11 Tf\r\n"
            + text[23] + b" Tj\r\n"
                         b"0 0 0 RG 0 0 0 rg\r\n1 0 0 1 304.75 677.926 Tm\r\n/F1\r\n 2.5 Tf\r\n" + text[
                24] + b" Tj\r\nET\r\n"
                      b"q 304.75 661.81 255.1 15.6 re W n\r\nBT\r\n1 0 0 1 304.75 664.288 Tm\r\n/F1\r\n 12 Tf\r\n"
            + text[25] + b" Tj\r\nET\r\nQ\r\n0 0 0 RG\r\n0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n"
                         b".501 .501 .501 RG .501 .501 .501 rg\r\n1 0 0 1 304.75 639.804 Tm\r\n/F1\r\n 11 Tf\r\n"
            + text[26] + b" Tj\r\n0 0 0 RG 0 0 0 rg\r\n"
                         b"1 0 0 1 304.75 635.032 Tm\r\n/F1\r\n 2.5 Tf\r\n" + text[27] + b" Tj\r\nET\r\n"
                                                                                         b"q 304.75 618.916 255.1 15.6 re W n\r\n"
                                                                                         b"BT\r\n1 0 0 1 304.75 621.394 Tm\r\n/F1\r\n 12 Tf\r\n" +
            text[28] + b" Tj\r\nET\r\nQ\r\n0 0 0 RG\r\n"
                       b"0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n1 0 0 1 304.75 596.91 Tm\r\n/F1\r\n"
                       b" 11 Tf\r\n" + text[29] + b" Tj\r\n0 0 0 RG 0 0 0 rg\r\n"
                                                  b"1 0 0 1 304.75 592.138 Tm\r\n/F1\r\n 2.5 Tf\r\n" + text[
                30] + b" Tj\r\nET\r\n"
                      b"q 304.75 576.022 255.1 15.6 re W n\r\n"
                      b"BT\r\n1 0 0 1 304.75 578.5 Tm\r\n/F1\r\n 12 Tf\r\n" + text[31] + b" Tj\r\n"
                                                                                         b"ET\r\nQ\r\n0 0 0 RG\r\n0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n"
                                                                                         b"1 0 0 1 304.75 554.016 Tm\r\n/F1\r\n 11 Tf\r\n" +
            text[32] + b" Tj\r\n"
                       b"0 0 0 RG 0 0 0 rg\r\n1 0 0 1 304.75 549.244 Tm\r\n/F1\r\n 2.5 Tf\r\n" + text[
                33] + b" Tj\r\nET\r\n"
                      b"q 304.75 533.128 255.1 15.6 re W n\r\nBT\r\n1 0 0 1 304.75 535.606 Tm\r\n/F1\r\n 12 Tf\r\n"
            + text[34] + b" Tj\r\n"
                         b"ET\r\nQ\r\n0 0 0 RG\r\n0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\n.501 .501 .501 RG .501 .501 .501 rg\r\n"
                         b"1 0 0 1 304.75 511.122 Tm\r\n/F1\r\n 11 Tf\r\n" + text[35] + b" Tj\r\n"
                                                                                        b"0 0 0 RG 0 0 0 rg\r\n1 0 0 1 304.75 506.35 Tm\r\n/F1\r\n 2.5 Tf\r\n" +
            text[36] + b" Tj\r\nET\r\n"
                       b"q 304.75 490.234 255.1 15.6 re W n\r\nBT\r\n1 0 0 1 304.75 492.712 Tm\r\n/F1\r\n 12 Tf\r\n"
            + text[37] + b" Tj\r\n"
                         b"ET\r\nQ\r\n0 0 0 RG\r\n0 0 0 rg\r\nBT\r\n/F1 12 Tf\r\nET\r\n")

    stream_num = 4
    symbols[0] = "\xa0"

    cmap_bias = update_cmap.update_cmap(list(set(using_ids)), file, file1, symbols, 6, from_bank="alfa")
    bias = decoder.replace_pdf_stream_advanced(file1, file1, text_stream_text, stream_num)
    update_xref.update_xref_alfa(cmap_bias, bias, file1)
