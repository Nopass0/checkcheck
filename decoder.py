import zlib
import re


def extract_flate_stream(pdf_path, stream_number=1):  # Извлекает и декодирует FlateDecode поток из PDF файла
    try:
        # Читаем PDF файл как бинарные данные
        with open(pdf_path, 'rb') as f:
            pdf_data = f.read()

        # Ищем все потоки в PDF
        streams = re.findall(rb'stream\s*(.*?)\s*endstream', pdf_data, re.DOTALL)

        if not streams:
            raise ValueError("В PDF файле не найдено потоков")

        if stream_number > len(streams) or stream_number < 1:
            raise ValueError(f"Поток #{stream_number} не существует. Всего найдено {len(streams)} потоков.")

        # Выбираем нужный поток
        stream_data = streams[stream_number - 1]

        # Пытаемся декодировать с помощью zlib (FlateDecode)
        dt = zlib.decompress(stream_data)

        return zlib.decompress(stream_data)

    except Exception as ex:
        raise RuntimeError(f"Ошибка при обработке PDF: {ex}")


def replace_pdf_stream_advanced(input_pdf, output_pdf, new_text, stream_number=1):
    """
        Заменяет указанный поток в PDF файле с правильным обновлением xref таблицы.
        """
    try:
        # Читаем PDF файл как бинарные данные
        with open(input_pdf, 'rb') as f:
            pdf_data = f.read()

        # Ищем все потоки в PDF
        streams = re.findall(rb'stream\s*(.*?)\s*endstream', pdf_data, re.DOTALL)

        if not streams:
            raise ValueError("В PDF файле не найдено потоков")

        if stream_number > len(streams) or stream_number < 1:
            raise ValueError(f"Поток #{stream_number} не существует. Всего найдено {len(streams)} потоков.")

        # Находим позицию нужного потока
        stream_pattern = rb'stream\s*' + re.escape(streams[stream_number - 1]) + rb'\s*endstream'
        stream_match = re.search(stream_pattern, pdf_data, re.DOTALL)

        if not stream_match:
            raise ValueError("Не удалось найти поток в файле")

        stream_start, stream_end = stream_match.span()
        stream_data_start = stream_start + len(b'stream')

        # Пропускаем EOL после "stream"
        while stream_data_start < len(pdf_data) and pdf_data[stream_data_start] in (10, 13):
            stream_data_start += 1

        # Находим начало данных потока (перед "endstream")
        stream_data_end = stream_end - len(b'endstream')

        # Убираем EOL перед "endstream"
        while stream_data_end > 0 and pdf_data[stream_data_end - 1] in (10, 13):
            stream_data_end -= 1

        # Кодируем новый текст
        encoded_data = new_text

        # Сжимаем данные с помощью zlib (FlateDecode)
        compressed_data = zlib.compress(encoded_data)

        # Вычисляем изменение длины
        old_length = stream_data_end - stream_data_start
        new_length = len(compressed_data)
        length_difference = new_length - old_length
        print(length_difference)

        # Обновляем длину в словаре объекта
        length_pattern = rb'/Length\s+(\d+)'
        length_match = list(re.finditer(length_pattern, pdf_data[:stream_start]))[-1]

        if length_match:
            length_start, length_end = length_match.span()
            old_length_str = pdf_data[length_start:length_end].decode('ascii')
            new_length_str = f'/Length {new_length}'

            pdf_data = pdf_data[:length_start] + new_length_str.encode() + pdf_data[length_end:]

            # Корректируем позиции после изменения длины
            length_change = len(new_length_str) - len(old_length_str)
            stream_start += length_change
            stream_data_start += length_change
            stream_data_end += length_change
            stream_end += length_change

        # Заменяем данные потока
        new_pdf_data = (
                pdf_data[:stream_data_start] +
                compressed_data +
                pdf_data[stream_data_end:]
        )

        # Сохраняем измененный PDF
        with open(output_pdf, 'wb') as f:
            f.write(new_pdf_data)

        print(f"Поток #{stream_number} успешно заменен. Новый файл сохранен как {output_pdf}")
        return length_difference

    except Exception as e:
        raise RuntimeError(f"Ошибка при обработке PDF: {e}")