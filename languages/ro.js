module.exports = {

    noPet: "❌ Nu ai niciun animal de companie. Folosește **/adopt** pentru a adopta unul!",

    alreadySleeping: "😴 Animalul tău doarme deja.",

    notSleeping: "❌ Animalul tău nu doarme.",

    feed: (pet) => `🍖 L-ai hrănit pe **${pet}**!

🍖 Foamea a crescut.
❤️ Viața a crescut.
✨ Ai câștigat XP.
💰 Ai primit monede!`,

    water: (pet) => `💧 I-ai dat apă lui **${pet}**!

💧 Setea a crescut.
❤️ Viața a crescut.
✨ Ai câștigat XP.
💰 Ai primit monede!`,

    play: (pet) => `🎾 Te-ai jucat cu **${pet}**!

😊 Fericirea a crescut.
✨ Ai câștigat XP.
💰 Ai primit monede!`,

    wash: (pet) => `🛁 L-ai spălat pe **${pet}**!

🧼 Curățenia a crescut.
😊 Fericirea a crescut.
✨ Ai câștigat XP.
💰 Ai primit monede!`,

    sleep: (pet) => `🌙 **${pet}** s-a culcat.

😴 Animalul tău se odihnește.

În timpul somnului:
🍖 Foamea nu scade.
💧 Setea nu scade.
🧼 Curățenia nu scade.
😊 Fericirea nu scade.

Folosește **/wake** când vrei să îl trezești.`,

    wake: (pet) => `☀️ **${pet}** s-a trezit!

😴 S-a odihnit bine și este gata pentru o nouă zi!

✨ Ai primit XP.
💰 Ai primit monede!`

};