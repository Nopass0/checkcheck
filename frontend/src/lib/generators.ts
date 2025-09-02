// Генераторы случайных данных

export function generateCardNumber(): string {
  // Генерируем номер карты в формате 408178102000****XXXX (меняются только последние 4 цифры)
  const lastFourDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const middle = Array.from({ length: 4 }, () => '*').join('')
  return `408178102000${middle}${lastFourDigits}`
}

export function generateOperationId(): string {
  // Генерируем ID операции в формате B52311723304650W0000XX (меняются только последние 2 цифры)
  const lastTwoDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  
  return `B52311723304650W0000${lastTwoDigits}`
}

export function generateReceiptNumber(): string {
  // Генерируем номер квитанции в формате 1-116-073-699-9XX (меняются только последние 2 цифры)
  const lastTwoDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0')
  
  return `1-116-073-699-9${lastTwoDigits}`
}

export function generateRandomAmount(): string {
  // Генерируем случайную сумму от 100 до 99999 (простое число без форматирования)
  const amount = Math.floor(Math.random() * 99900) + 100
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

// Генератор имени с инициалом для получателя
export function generateRecipientName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastInitial = String.fromCharCode(1040 + Math.floor(Math.random() * 32)) // А-Я
  
  return `${firstName} ${lastInitial}.`
}

export function generateRandomPhone(): string {
  // Генерируем номер в формате +7 (9XX) XXX-XX-XX
  const code = Math.floor(Math.random() * 100) + 900 // 900-999
  const part1 = Math.floor(Math.random() * 900) + 100 // 100-999
  const part2 = Math.floor(Math.random() * 90) + 10   // 10-99
  const part3 = Math.floor(Math.random() * 90) + 10   // 10-99
  
  return `+7 (${code}) ${part1}-${part2}-${part3}`
}

const banks = [
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
