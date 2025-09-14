import decoder


def update_cmap(using_simbols, file, file1, symbols, stream_num, from_bank):  # обновление cmap таблицы
    cmap_table = b""
    cnt = 1
    if from_bank == "t_bank":
        for symbol in symbols:
            if symbols.index(symbol) + 1 in using_simbols:
                cmap_table += f"\n<{str(hex(cnt)[2:]).zfill(4)}><{str(hex(cnt)[2:]).zfill(4)}><{hex(ord(symbol))[2:].zfill(4)}>".encode('utf-8')
            cnt += 1
    elif from_bank == "alfa":
        for symbol in symbols:
            if symbols.index(symbol) + 1 in using_simbols:
                cmap_table += f"\r\n<{str(hex(cnt)[2:]).zfill(4).upper()}> <{hex(ord(symbol))[2:].zfill(4).upper()}>".encode(
                    'utf-8')
            cnt += 1

    print(cmap_table)

    stream_text = decoder.extract_flate_stream(file, stream_num)
    if from_bank == "t_bank":
        new_stream_text = stream_text[:241] + cmap_table + stream_text[1533:]
    elif from_bank == "alfa":
        new_stream_text = stream_text[:259] + cmap_table + stream_text[1099:]

    return decoder.replace_pdf_stream_advanced(file, file1, new_stream_text, stream_num)



