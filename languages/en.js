module.exports = {

    noPet: "❌ You don't have a pet. Use **/adopt** to adopt one!",

    alreadySleeping: "😴 Your pet is already sleeping.",

    notSleeping: "❌ Your pet isn't sleeping.",

    feed: (pet) => `🍖 You fed **${pet}**!

🍖 Hunger increased.
❤️ Health increased.
✨ You earned XP.
💰 You earned coins!`,

    water: (pet) => `💧 You gave **${pet}** some water!

💧 Thirst increased.
❤️ Health increased.
✨ You earned XP.
💰 You earned coins!`,

    play: (pet) => `🎾 You played with **${pet}**!

😊 Happiness increased.
✨ You earned XP.
💰 You earned coins!`,

    wash: (pet) => `🛁 You washed **${pet}**!

🧼 Cleanliness increased.
😊 Happiness increased.
✨ You earned XP.
💰 You earned coins!`,

    sleep: (pet) => `🌙 **${pet}** went to sleep.

😴 Your pet is now resting.

While sleeping:
🍖 Hunger won't decrease.
💧 Thirst won't decrease.
🧼 Cleanliness won't decrease.
😊 Happiness won't decrease.

Use **/wake** when you want to wake your pet.`,

    wake: (pet) => `☀️ **${pet}** woke up!

😴 Your pet had a good rest and is ready for a new day!

✨ You earned XP.
💰 You earned coins!`

};