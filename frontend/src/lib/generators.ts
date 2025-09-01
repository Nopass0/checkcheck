// Генераторы случайных данных

export function generateCardNumber(): string {
  // Генерируем номер карты в формате 408178102000****7022
  const prefix = "408178102000"
  const suffix = "7022"
  const middle = Array.from({ length: 4 }, () => '*').join('')
  return `${prefix}${middle}${suffix}`
}

export function generateOperationId(): string {
  // Генерируем ID операции в формате A52351158320990600000200115
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const letter = letters[Math.floor(Math.random() * letters.length)]
  
  // Генерируем 24 цифры
  const numbers = Array.from({ length: 24 }, () => 
    Math.floor(Math.random() * 10)
  ).join('')
  
  return `${letter}${numbers}`
}

export function generateReceiptNumber(): string {
  // Генерируем номер квитанции в формате 1-115-078-540-299 (без знака №)
  const part1 = Math.floor(Math.random() * 9) + 1 // 1-9
  const part2 = Math.floor(Math.random() * 900) + 100 // 100-999
  const part3 = Math.floor(Math.random() * 900) + 100 // 100-999
  const part4 = Math.floor(Math.random() * 900) + 100 // 100-999
  const part5 = Math.floor(Math.random() * 900) + 100 // 100-999
  
  return `${part1}-${part2}-${part3}-${part4}-${part5}`
}

export function generateRandomAmount(): string {
  // Генерируем случайную сумму от 100 до 99999
  const amount = Math.floor(Math.random() * 99900) + 100
  
  // Форматируем с пробелами между тысячами
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' '
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

export function generateRandomName(): string {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNamePrefixes[Math.floor(Math.random() * lastNamePrefixes.length)]
  
  // Добавляем инициал отчества
  const middleInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z
  
  return `${firstName} ${lastName.charAt(0)}.`
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
