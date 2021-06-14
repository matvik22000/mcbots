/**
 * This bot example shows the basic usage of the mineflayer-pvp plugin for guarding a defined area from nearby mobs.
 */

const mineflayer = require('mineflayer')
const {pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin

for (let i = 15; i >= 5; i--) {
    if (i === 5) {
        f(i, true)
    } else {
        setTimeout(function(){
            console.log(i)
            f(i, false);
        },3000 * i);
    }

}

function f(i, isMain) {


    const bot = mineflayer.createBot({
        //host: 'beby.aternos.me', // minecraft server ip
        host: 'ehrs.aternos.me',
        username: 'amogussus' + i, // minecraft username
        port: 27794
    })

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)

    let guardPos = null

// Assign the given location to be guarded
    function guardArea(pos) {
        guardPos = pos

        // We we are not currently in combat, move to the guard pos
        if (!bot.pvp.target) {
            moveToGuardPos()
        }
    }

// Cancel all pathfinder and combat
    function stopGuarding() {
        guardPos = null
        bot.pvp.stop()
        bot.pathfinder.setGoal(null)
    }

// Pathfinder to the guard position
    function moveToGuardPos() {
        const mcData = require('minecraft-data')(bot.version)
        bot.pathfinder.setMovements(new Movements(bot, mcData))
        bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
    }

// Called when the bot has killed it's target.
    bot.on('stoppedAttacking', () => {
        if (guardPos) {
            moveToGuardPos()
        }
    })

// Check for new enemies to attack
    bot.on('physicsTick', () => {
        if (!guardPos) return // Do nothing if bot is not guarding anything

        // Only look for mobs within 16 blocks
        const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) < 16 &&
            e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

        const entity = bot.nearestEntity(filter)
        if (entity) {
            // Start attacking
            bot.pvp.attack(entity)
        }
    })

// Listen for player commands
    bot.on('chat', (username, message) => {
        // Guard the location the player is standing
        console.log(message)
        if (message === 'guard') {
            const player = bot.players[username]

            if (!player) {
                bot.chat("I can't see you.")
                return
            }

            bot.chat('I will guard that location.')
            guardArea(player.entity.position)
        }

        // Stop guarding
        else if (message === 'stop') {
            bot.chat('I will no longer guard this area.')
            stopGuarding()
        }
        else {
            // if (isMain && username !== bot.username) {
            //     bot.chat('amogus!')
            // }
        }

    })
}