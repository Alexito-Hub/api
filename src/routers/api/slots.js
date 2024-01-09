const { Router } = require('express');
const router = new Router();

const fruits = ['🍒', '🍇', '🍋', '🍓', '🪙'];
const prizes = {
  '🍒🍒🍒': { chance: 0.4, reward: 500 },
  '🍇🍇🍇': { chance: 0.7, reward: 100 },
  '🍋🍋🍋': { chance: 0.9, reward: 30 },
  '🍓🍓🍓': { chance: 0.2, reward: 1000 },
  '🪙🪙🪙': { chance: 0.01, reward: 10000 },
};

router.get('/', (req, res) => {
  try {
    const result = getRandomFruits();
    const coins = evaluatePrizes(result);

    const response = {
      creator: 'Zio',
      status: 200,
      game: {
        message: coins >= 0 ? '¡Ganaste!' : 'Perdiste',
        coins: coins,
        casino: result
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: 'openai',
      status: 500,
      error: '[!] Error al procesar la solicitud del juego'
    });
  }
});

function getRandomFruits() {
  return Array.from({ length: 3 }, () => fruits[Math.floor(Math.random() * fruits.length)]);
}

function evaluatePrizes(result) {
  const combination = result.join('');
  const prize = prizes[combination];
  if (prize) {
    return Math.random() < prize.chance ? prize.reward : prize.reward / 2; // Ganancia mínima
  }
  if (new Set(result).size === 1) {
    return 0;
  }
  return -50;
}


module.exports = router;