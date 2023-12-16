const jwt = require('jsonwebtoken');
const crypto = require('crypto');
let jwtSecret = generateNewSecret();
let jwtExpirationTime = 3600; // Время истечения срока действия токена в секундах (1 час)

updateSecretAndExpirationTimer();

function generateNewSecret() {
  // Генерация случайной фразы в качестве нового секретного ключа
  return crypto.randomBytes(7).toString('hex');
}

function updateSecretAndExpirationTimer() {
  setTimeout(() => {
    jwtSecret = generateNewSecret(); // Обновление секретного ключа
    jwtExpirationTime = 7200; // Обновление времени истечения срока действия токена через 2 часа
    updateSecretAndExpirationTimer(); // Планирование следующего обновления через 2 часа
  }, 7200 * 1000); // 2 часа в миллисекундах
}

module.exports = {
  get jwtSecret() {
    return jwtSecret;
  },
  get jwtExpirationTime() {
    return jwtExpirationTime;
  },
};