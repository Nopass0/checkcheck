// Генераторы случайных данных

export function generateCardNumber(isAlfa: boolean = false): string {
  if (isAlfa) {
    // Для Альфа Банка: 40817810805600376XXX (меняются последние 3 цифры)
    const lastThreeDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `40817810805600376${lastThreeDigits}`
  } else {
    // Для Т Банка: 408178102000****XXXX (меняются только последние 4 цифры)
    const lastFourDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const middle = Array.from({ length: 4 }, () => '*').join('')
    return `408178102000${middle}${lastFourDigits}`
  }
}

export function generateOperationId(isAlfa: boolean = false): string {
  if (isAlfa) {
    // Для Альфа Банка: B52231829434200O0000120011570XXX (меняются последние 3 цифры)
    const lastThreeDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `B52231829434200O0000120011570${lastThreeDigits}`
  } else {
    // Для Т Банка: B52311723304650W0000XX (меняются только последние 2 цифры)
    const lastTwoDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `B52311723304650W0000${lastTwoDigits}`
  }
}

export function generateReceiptNumber(isAlfa: boolean = false): string {
  if (isAlfa) {
    // Для Альфа Банка: C421108251242XXX (меняются последние 3 цифры)
    const lastThreeDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `C421108251242${lastThreeDigits}`
  } else {
    // Для Т Банка: 1-116-073-699-9XX (меняются только последние 2 цифры)
    const lastTwoDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `1-116-073-699-9${lastTwoDigits}`
  }
}

export function generateRandomAmount(isAlfa: boolean = false): string {
  // Генерируем случайную сумму от 100 до 99999
  const amount = Math.floor(Math.random() * 99900) + 100

  if (isAlfa) {
    // Для Альфа Банка добавляем пробел для тысяч (например: 14 900)
    if (amount >= 1000) {
      const thousands = Math.floor(amount / 1000)
      const remainder = amount % 1000
      return `${thousands} ${remainder.toString().padStart(3, '0')}`
    }
  }

  return amount.toString()
}

// Список случайных имен
const firstNames = [
  'Александр', 'Дмитрий', 'Максим', 'Сергей', 'Андрей', 'Алексей', 'Артем', 'Илья', 'Кирилл', 'Михаил',
  'Анна', 'Мария', 'Елена', 'Ольга', 'Татьяна', 'Наталья', 'Ирина', 'Светлана', 'Екатерина', 'Юлия'
]

const lastNamePrefixes = [
  'Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Соколов', 'Михайлов', 'Новиков',
  'Федоров', 'Морозов', 'Волков', 'Алексеев', 'Лебедев', 'Семенов', 'Егоров', 'Павлов', 'Козлов', 'Степанов'
]

// Генератор полного имени для отправителя
export function generateSenderName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNamePrefixes[Math.floor(Math.random() * lastNamePrefixes.length)]
  
  return `${firstName} ${lastName}`
}

// Список отчеств
const patronymics = [
  'Александрович', 'Дмитриевич', 'Максимович', 'Сергеевич', 'Андреевич',
  'Алексеевич', 'Артемович', 'Ильич', 'Кириллович', 'Михайлович',
  'Тагирович', 'Русланович', 'Игоревич', 'Олегович', 'Николаевич'
]

// Генератор имени с инициалом для получателя
export function generateRecipientName(isAlfa: boolean = false): string {
  if (isAlfa) {
    // Для Альфа Банка: Имя Отчество Инициал (например: Ильман Тагирович Д)
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const patronymic = patronymics[Math.floor(Math.random() * patronymics.length)]
    const lastInitial = String.fromCharCode(1040 + Math.floor(Math.random() * 32)) // А-Я
    return `${firstName} ${patronymic} ${lastInitial}`
  } else {
    // Для Т Банка: Имя Инициал. (например: Анна К.)
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastInitial = String.fromCharCode(1040 + Math.floor(Math.random() * 32)) // А-Я
    return `${firstName} ${lastInitial}.`
  }
}

export function generateRandomPhone(isAlfa: boolean = false): string {
  const code = Math.floor(Math.random() * 100) + 900 // 900-999
  const part1 = Math.floor(Math.random() * 900) + 100 // 100-999
  const part2 = Math.floor(Math.random() * 90) + 10   // 10-99
  const part3 = Math.floor(Math.random() * 90) + 10   // 10-99

  if (isAlfa) {
    // Для Альфа Банка: 79XXXXXXXXX (11 цифр без форматирования)
    return `7${code}${part1}${part2}${part3}`
  } else {
    // Для Т Банка: +7 (9XX) XXX-XX-XX
    return `+7 (${code}) ${part1}-${part2}-${part3}`
  }
}

const banks = [
  'Т-Банк',
  'Тинькофф Банк',
  'Сбер',
  'ВТБ',
  'Альфа-Банк',
  'Газпромбанк',
  'Россельхозбанк',
  'Райффайзенбанк',
  'МКБ',
  'Банк Открытие',
  'Почта Банк'
]

export function generateRandomBank(): string {
  return banks[Math.floor(Math.random() * banks.length)]
}
