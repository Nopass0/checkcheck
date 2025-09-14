def update_xref_t_bank(cmap_bias, text_bias, file):  # бновление таблицы xref
    update_font_1_refs = [12, 13, 14, 25, 23, 9, 1, 2, 3, 4, 5, 15, 16, 17, 18, 19, 20, 21, 22, 24]
    update_font_1_width_refs = [14, 25, 23, 9, 1, 2, 3, 4, 5, 15, 16, 17, 18, 19, 20, 21, 22, 24]
    update_font_2_refs = [25, 23, 9, 2, 3, 4, 5, 16, 17, 18, 19, 20, 21, 22, 24]
    update_font_2_width_refs = [25, 23, 9, 2, 3, 4, 5, 18, 19, 20, 21, 22, 24]
    update_text_refs = [10, 11, 12, 13, 14, 25, 23, 9, 0, 1, 2, 3, 4, 5, 15, 16, 17, 18, 19, 20, 21, 22, 24]
    update_cmap_refs = [25, 23, 9, 1, 2, 3, 4, 5, 15, 16, 17, 18, 19, 20, 21, 22, 24]
    update_cmap_2_refs = [25, 23, 9, 2, 3, 4, 5, 19, 20, 21, 22, 24]

    font_1_bias = 4896 + 1
    font_1_width_bias = 682
    font_2_bias = -86
    font_2_width_bias = 48
    cmap_2_bias = 47
    xref = [
        42527, 53513, 57190, 58623, 58801,
        58826, 27127, 41297, 41420, 58851,
        42849, 42885, 52028, 52218, 52814,
        53654, 56389, 56580, 56851, 57330,
        58447, 58903, 58959, 58993, 59099,
        59424, 3345, 8667,
    ]

    for ref in update_font_1_refs:
        xref[ref] += font_1_bias

    for ref in update_font_1_width_refs:
        xref[ref] += font_1_width_bias

    for ref in update_font_2_refs:
        xref[ref] += font_2_bias

    for ref in update_font_2_width_refs:
        xref[ref] += font_2_width_bias

    for ref in update_cmap_refs:
        xref[ref] += cmap_bias

    for ref in update_cmap_2_refs:
        xref[ref] += cmap_2_bias

    for ref in update_text_refs:
        xref[ref] += text_bias

    xref_text = (f"ref\n0 29\n0000000000 65535 f \n00000{xref[0]} 00000 n "
                 f"\n00000{xref[1]} 00000 n \n0000000015 00000 n \n{str(xref[26]).zfill(10)} 00000 n "
                 f"\n00000{xref[2]} 00000 n \n00000{xref[3]} 00000 n \n00000{xref[4]} 00000 n "
                 f"\n00000{xref[5]} 00000 n \n{str(xref[27]).zfill(10)} 00000 n \n00000{xref[6]} 00000 n "
                 f"\n00000{xref[7]} 00000 n \n00000{xref[8]} 00000 n \n00000{xref[9]} 00000 n "
                 f"\n00000{xref[10]} 00000 n \n00000{xref[11]} 00000 n \n00000{xref[12]} 00000 n "
                 f"\n00000{xref[13]} 00000 n \n00000{xref[14]} 00000 n \n00000{xref[15]} 00000 n "
                 f"\n00000{xref[16]} 00000 n \n00000{xref[17]} 00000 n \n00000{xref[18]} 00000 n "
                 f"\n00000{xref[19]} 00000 n \n00000{xref[20]} 00000 n \n00000{xref[21]} 00000 n "
                 f"\n00000{xref[22]} 00000 n \n00000{xref[23]} 00000 n \n00000{xref[24]} 00000 n "
                 f"\ntrailer\n<</Info 28 0 R/ID "
                 f"[<b21a512d6afe6adee0b5766df0f53708><4f308c6dc6f3d356e63c88e3b5038b0b>]/Root 27 0 R/Size 29>>"
                 f"\nstartxref\n{xref[25]}\n%%EOF\n")

    with open(file, "rb") as f:
        file_text = f.read()

    new_file_text = file_text[:-730] + xref_text.encode('utf-8')

    with open(file, "wb") as f:
        f.write(new_file_text)


def update_xref_alfa(cmap_bias, text_bias, file):  # бновление таблицы xref
    xref = [
        42032, 42087, 42169, 42237, 25577,
        26839, 40843, 41001, 42368, 42521,
        43368, 43580, 56772, 57329, 57381,
        57433,
    ]

    update_font_1_refs = [15, 12, 13, 14]
    update_font_1_width_refs = [15, 10, 11, 12, 13, 14]
    update_text_refs = [15, 0, 2, 1, 3, 8, 9, 10, 11, 12, 13, 14]
    update_cmap_refs = [15, 13, 14]

    font_1_bias = 11705
    font_1_width_bias = 417

    for ref in update_font_1_refs:
        xref[ref] += font_1_bias

    for ref in update_font_1_width_refs:
        xref[ref] += font_1_width_bias

    for ref in update_cmap_refs:
        xref[ref] += cmap_bias

    for ref in update_text_refs:
        xref[ref] += text_bias

    xref_text = (f"ref\r\n0 17\r\n0000000000 65535 f\r\n00000{xref[0]} 00000 n"
                 f"\r\n00000{xref[1]} 00000 n\r\n00000{xref[2]} 00000 n\r\n00000{xref[3]} 00000 n"
                 f"\r\n0000000010 00000 n\r\n00000{xref[4]} 00000 n\r\n00000{xref[5]} 00000 n"
                 f"\r\n00000{xref[6]} 00000 n\r\n00000{xref[7]} 00000 n\r\n00000{xref[8]} 00000 n"
                 f"\r\n00000{xref[9]} 00000 n\r\n00000{xref[10]} 00000 n\r\n00000{xref[11]} 00000 n"
                 f"\r\n00000{xref[12]} 00000 n\r\n00000{xref[13]} 00000 n\r\n00000{xref[14]} 00000 n"
                 f"\r\ntrailer\r\n<<\r\n/Size 17\r\n/Root 1 0 R\r\n/Info 2 0 R\r\n/ID "
                 f"[<9caf19c2a8b01aee87c1b3d5041b5a93><9caf19c2a8b01aee87c1b3d5041b5a93>]"
                 f"\r\n>>\r\nstartxref\r\n{xref[15]}\r\n%%EOF\r\n")

    with open(file, "rb") as f:
        file_text = f.read()

    new_file_text = file_text[:-505] + xref_text.encode('utf-8')

    with open(file, "wb") as f:
        f.write(new_file_text)
