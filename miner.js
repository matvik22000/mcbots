/**
 * This bot example shows how to collect a vein of ores quickly after only finding a single block.
 * This makes it easy to collect a vein of ores or mine a tree without looking for every block in the
 * area.
 */

const mineflayer = require('mineflayer')
const collectBlock = require('mineflayer-collectblock').plugin

if (process.argv.length < 4 || process.argv.length > 6) {
    console.log('Usage : node oreMiner.js <host> <port> [<name>] [<password>]')
    process.exit(1)
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: process.argv[3],
    username: process.argv[4] || 'oreMiner',
    password: process.argv[5]
})

bot.loadPlugin(collectBlock)

let mcData
bot.once('spawn', () => {
    mcData = require('minecraft-data')(bot.version)
})

bot.on('chat', (username, message) => {
    const args = message.split(' ')
    if (args[0] !== 'collect') return

    const blockType = mcData.blocksByName[args[1]]
    if (!blockType) {
        bot.chat(`"I don't know any blocks named ${args[1]}.`)
        return
    }
    console.log(args[1])
    const block = bot.findBlock({
        matching: blockType.id,
        maxDistance: 64
    })
    console.log(block)

    if (!block) {
        bot.chat("I don't see that block nearby.")
        return
    }

    const targets = bot.collectBlock.findFromVein(block, 2)
    bot.collectBlock.collect(targets, err => {
        if (err) {
            // An error occurred, report it.
            bot.chat(err.message)
            console.log(err)
        } else {
            // All blocks have been collected.
            bot.chat('Done')
        }
    })
})