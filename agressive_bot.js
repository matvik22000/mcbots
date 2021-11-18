const mineflayer = require('mineflayer')
const Vec3 = require('vec3').Vec3
const {pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const pvp = require('mineflayer-pvp').plugin
const minecraftHawkEye = require('minecrafthawkeye');
const {standalone} = require('prismarine-viewer')
const inventoryViewer = require('mineflayer-web-inventory')
fs = require('fs');
const {
    StateTransition,
    BotStateMachine,
    NestedStateMachine,
    BehaviorPlaceBlock,
    BehaviorEquipItem,
    BehaviorIdle,
    StateMachineWebserver,
    BehaviorMineBlock,
    BehaviorMoveTo
} = require("mineflayer-statemachine");

let mcData
const targets = {
    item: 0
}
let build_item;
let count = 5
let building = [];
let transition_trigger = []
let brake_timeout = []
let TIMEOUT = 8000
const PORT = 49958
const HOST = 'BTAnarchya.aternos.me'
// const HOST = "127.0.0.1"


for (let i = 0; i < count; i++) {
    setTimeout(() => {
        builder1(i)
    }, 10000 * i)

    building.push(false)
    transition_trigger.push(false)
    brake_timeout.push(false)
}
console.log(building)


function builder1(i) {
    let bot = mineflayer.createBot({
        //host: 'beby.aternos.me', // minecraft server ip
        host: HOST,
        username: 'bebrik' + i, // minecraft username
        port: PORT
    })
    // inventoryViewer(bot)
    // bot.loadPlugin(minecraftHawkEye)
    bot.loadPlugin(require('mineflayer-pathfinder').pathfinder)

    bot.on("chat", (username, message) => {
        if (username === bot.username) return
        if (i !== 0) return;
        fs.appendFile("chat.txt", message + "\n", () => {})
        bot.chat(`Политех - хуйня, ИТМО - класс, кто не согласен - тот пидорас`)

    })



    bot.on("spawn", () => {
        mcData = require('minecraft-data')(bot.version)
        // build_item = mcData.blocksByName["dirt"].type;
        build_item = 15;
        // console.log(build_item)
        let idle = new BehaviorIdle()
        const collectingGrass = createCollectItemState(bot, i, "grass_block")
        const buildState = createBuildState(bot, i)
        const caclPos = new BehaviorCalcPos(bot, targets)
        const moveTo = new BehaviorMoveTo(bot, targets)
        // console.log(bot.inventory)
        // console.log(bot.inventory.count(15, null))


        const transitions = [
            new StateTransition({
                parent: idle,
                child: collectingGrass,
                shouldTransition: () => bot.inventory.count(build_item, null) <= 10
            }),

            new StateTransition({
                parent: idle,
                child: caclPos,
                shouldTransition: () => bot.inventory.count(build_item, null) > 10
            }),

            new StateTransition({
                parent: collectingGrass,
                child: caclPos,
                shouldTransition: () => bot.inventory.count(build_item, null) > 10
            }),

            new StateTransition({
                parent: caclPos,
                child: moveTo,
                shouldTransition: () => true,
                onTransition: () => targets.brake_timeout = setTimeout(() => brake_timeout[i] = true, TIMEOUT)
            }),

            new StateTransition({
                parent: moveTo,
                child: buildState,
                shouldTransition: () => moveTo.distanceToTarget() < 0.5 || brake_timeout[i],
                onTransition: () => {
                    building[i] = true
                    brake_timeout[i] = false
                    try {
                        clearTimeout(targets.brake_timeout)
                    } catch (e) {
                    }
                }
            }),

            new StateTransition({
                parent: buildState,
                child: idle,
                shouldTransition: () => building[i] === false
            }),

        ]

        const port = 1340 + i
        const rootLayer = new NestedStateMachine(transitions, idle);
        setTimeout(() => {
            const stateMachine = new BotStateMachine(bot, rootLayer);
            const webserver = new StateMachineWebserver(bot, stateMachine, port + i);
            webserver.startServer();
        }, 500)
    })

}

// function worker(i) {
//     let bot = mineflayer.createBot({
//         //host: 'beby.aternos.me', // minecraft server ip
//         host: HOST,
//         username: 'amogussus' + i, // minecraft username
//         port: PORT
//     })
//     bot.loadPlugin(require('mineflayer-collectblock').plugin)
//
//     bot.on("spawn", () => {
//         mcData = require('minecraft-data')(bot.version)
//         let targets = {}
//         const log = "oak_wood"
//         const planks = "oak_planks"
//         const crafting_table = "crafting_table"
//
//         const collectWood = createCollectItemState(bot, i, log)
//         const craft = BehaviorCraft(bot, targets)
//         const placeTable = new BehaviorPlaceBlock(bot, targets)
//
//         const transitions = [
//             new StateTransition({
//                 parent: collectWood,
//                 child: craft,
//                 shouldTransition: () => bot.inventory.count(mcData.blocksByName[log].id, null) >= 4,
//                 onTransition: () => {
//                     targets.item = mcData.blocksByName[planks].id
//                     targets.count = 3
//                 }
//             }),
//
//             new StateTransition({
//                 parent: craft,
//                 child: craft,
//                 shouldTransition: () => bot.inventory.count(mcData.blocksByName[planks].id, null) >= 12,
//                 onTransition: () => {
//                     targets.item = mcData.blocksByName[crafting_table].id
//                     targets.count = 1
//                 }
//             }),
//
//             new StateTransition({
//                 parent: craft,
//                 child: placeTable,
//                 shouldTransition: () => bot.inventory.count(mcData.blocksByName[crafting_table].id, null) >= 1,
//                 onTransition: () => {
//                     targets.position = bot.entity.position
//                     this.targets.blockFace = new Vec3(0, 1, 0)
//                     targets.item = mcData.blocksByName[crafting_table].id
//
//                 }
//             }),
//         ]
//
//         const port = 1340
//         const rootLayer = new NestedStateMachine(transitions, collectWood);
//         setTimeout(() => {
//             const stateMachine = new BotStateMachine(bot, rootLayer);
//             const webserver = new StateMachineWebserver(bot, stateMachine, port + i);
//             webserver.startServer();
//         }, 500)
//
//     })
//
// }

const BehaviorPrepareToPlacing = (function () {
    name = "BehaviorPrepareToPlacing"

    function BehaviorPrepareToPlacing(bot, targets, block_name) {
        this.bot = bot
        this.targets = targets
        this.active = false;
        this.stateName = "BehaviorPrepareToPlacing";
        this.block_name = block_name

    }

    BehaviorPrepareToPlacing.prototype.onStateEntered = function () {
        this.targets.item = mcData.blocksByName[this.block_name].id
        this.targets.blockFace = new Vec3(0, 1, 0)

        this.targets.positions = [
            new Vec3(this.bot.entity.position.x, this.bot.entity.position.y, this.bot.entity.position.z + 2),
            new Vec3(this.bot.entity.position.x + 1, this.bot.entity.position.y, this.bot.entity.position.z + 2),
            new Vec3(this.bot.entity.position.x - 1, this.bot.entity.position.y, this.bot.entity.position.z + 2),
            new Vec3(this.bot.entity.position.x, this.bot.entity.position.y + 1, this.bot.entity.position.z + 2),
            new Vec3(this.bot.entity.position.x, this.bot.entity.position.y + 2, this.bot.entity.position.z + 2),
            new Vec3(this.bot.entity.position.x, this.bot.entity.position.y + 3, this.bot.entity.position.z + 2)
        ]

        console.log(this.targets)
    }

    BehaviorPrepareToPlacing.prototype.onStateExited = function () {
    }
    return BehaviorPrepareToPlacing;
}())

const BehaviorNextBlock = (function () {

    function BehaviorNextBlock(bot, targets, block_name) {
        this.bot = bot
        this.targets = targets
        this.active = false;
        this.stateName = "BehaviorNextBlock";
        this.block_name = block_name


    }

    BehaviorNextBlock.prototype.onStateEntered = function () {
        this.targets.item = mcData.blocksByName[this.block_name].id
        this.targets.position = this.targets.positions.pop(0)

    }

    BehaviorNextBlock.prototype.onStateExited = function () {
    }
    return BehaviorNextBlock;
}())


const BehaviorLookAt = (function () {

    function BehaviorLookAt(bot, targets) {
        this.bot = bot
        this.targets = targets
        this.active = false;
        this.stateName = "BehaviorLookAt";


    }

    BehaviorLookAt.prototype.onStateEntered = function () {
        this.bot.lookAt(this.targets.position);

    }

    BehaviorLookAt.prototype.onStateExited = function () {
    }
    return BehaviorLookAt;
}())


const BehaviorCalcPos = (function () {

    function BehaviorCalcPos(bot, targets) {
        this.bot = bot
        this.targets = targets
        this.active = false;
        this.stateName = "BehaviorCalcPos";
    }

    BehaviorCalcPos.prototype.onStateEntered = function () {
        let offsetx = Math.floor(Math.random() * 10)
        let offsetz = Math.floor(Math.random() * 10)

        let y = this.bot.entity.position.y
        if (this.bot.blockAt(new Vec3(this.bot.entity.position.x + offsetx, y, this.bot.entity.position.z + offsetz)).name === "air") {
            while (this.bot.blockAt(new Vec3(this.bot.entity.position.x + offsetx, y, this.bot.entity.position.z + offsetz)).name === "air") {
                y--;
            }
        } else {
            while (this.bot.blockAt(new Vec3(this.bot.entity.position.x + offsetx, y, this.bot.entity.position.z + offsetz)).name !== "air") {
                y++;
            }
        }

        this.targets.position = new Vec3(this.bot.entity.position.x + offsetx, y + 1, this.bot.entity.position.z + offsetz)
    }

    BehaviorCalcPos.prototype.onStateExited = function () {

    }
    return BehaviorCalcPos
}())


const BehaviorFindBlock = (function () {

    function BehaviorFindBlock(bot, targets) {
        this.bot = bot
        this.targets = targets
        this.active = false;
        this.stateName = "BehaviorFindBlock";
    }

    BehaviorFindBlock.prototype.onStateEntered = function () {
        this.targets.position = this.bot.findBlock({
            matching: [mcData.blocksByName["grass_block"].id],
            maxDistance: 64
        }).position
    }

    BehaviorFindBlock.prototype.onStateExited = function () {

    }
    return BehaviorFindBlock
}())

const ExitBuilding = (function () {

    function ExitBuilding(bot, targets, i) {
        this.bot = bot
        this.targets = targets
        this.active = false;
        this.stateName = "ExitBuilding";
        this.i = i
    }

    ExitBuilding.prototype.onStateEntered = function () {
        building[this.i] = false;
        console.log(building)
    }

    ExitBuilding.prototype.onStateExited = function () {
        this.bot.chat("хуй построен на координатах " + this.bot.entity.position)
        console.log("хуй построен на координатах " + this.bot.entity.position + " " + this.bot.name)
    }
    return ExitBuilding
}())


function createBuildState(bot, i) {
    const targets = {
        targets: [0]
    }
    const exit = new ExitBuilding(bot, targets, i)

    const equipItem = new BehaviorEquipItem(bot, targets)
    const placeBlock = new BehaviorPlaceBlock(bot, targets)
    const prepare = new BehaviorPrepareToPlacing(bot, targets, "dirt")
    const nextBlock = new BehaviorNextBlock(bot, targets, "dirt")

    const transitions = [

        new StateTransition({
            parent: prepare,
            child: equipItem,
            shouldTransition: () => true,
            onTransition: () => console.log(targets)
        }),

        new StateTransition({
            parent: equipItem,
            child: nextBlock,
            shouldTransition: () => true,
        }),

        new StateTransition({
            parent: nextBlock,
            child: placeBlock,
            shouldTransition: () => true,
        }),

        new StateTransition({
            parent: placeBlock,
            child: nextBlock,
            shouldTransition: () => targets.positions.length !== 0,
        }),

        new StateTransition({
            parent: placeBlock,
            child: exit,
            shouldTransition: () => targets.positions.length === 0,
            onTransition: () => console.log(targets)
        })
    ]

    return new NestedStateMachine(transitions, prepare, exit);

}


function createCollectItemState(bot, i, block_name) {
    const targets = {
        item: block_name
    };
    const findBlock = new BehaviorFindBlock(bot, targets)
    const moveTo = new BehaviorMoveTo(bot, targets)
    const mineBlock = new BehaviorMineBlock(bot, targets)
    const lookAt = new BehaviorLookAt(bot, targets)

    const exit = new BehaviorIdle();

    const transitions = [
        new StateTransition({
            parent: findBlock,
            child: moveTo,
            shouldTransition: () => true,
            onTransition: () => targets.brake_timeout = setTimeout(() => brake_timeout[i] = true, TIMEOUT)
        }),

        new StateTransition({
            parent: moveTo,
            child: lookAt,
            shouldTransition: () => moveTo.distanceToTarget() < 1 || brake_timeout[i],
            onTransition: () => {
                brake_timeout[i] = false
                try {
                    clearTimeout(targets.brake_timeout)
                } catch (e) {
                }
            }

        }),

        new StateTransition({
            parent: lookAt,
            child: mineBlock,
            shouldTransition: () => true,
            onTransition: () => targets.brake_timeout = setTimeout(() => brake_timeout[i] = true, TIMEOUT)
        }),

        new StateTransition({
            parent: mineBlock,
            child: findBlock,
            shouldTransition: () => (bot.blockAt(targets.position).name === "air" && bot.inventory.count(build_item, null) <= 10) || brake_timeout[i],
            onTransition: () => {
                brake_timeout[i] = false
                try {
                    clearTimeout(targets.brake_timeout)
                } catch (e) {
                }
            }
        }),


        new StateTransition({
            parent: mineBlock,
            child: exit,
            shouldTransition: () => bot.blockAt(targets.position).name === "air" && bot.inventory.count(build_item, null) > 10
        }),
    ]

    return new NestedStateMachine(transitions, findBlock, exit)
}


// const BehaviorCraft = (function () {
//
//     function BehaviorCraft(bot, targets) {
//         this.bot = bot
//         this.targets = targets
//         this.active = false;
//         this.stateName = "BehaviorCraft";
//
//     }
//
//     BehaviorCraft.prototype.onStateEntered = function () {
//         this.bot.craft(this.bot.recipesFor(this.targets.item, null, null, null)[0], this.targets.count, null)
//     }
//
//     BehaviorCraft.prototype.onStateExited = function () {
//
//     }
//     return BehaviorCraft
// }())

