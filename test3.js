const mcData = require('minecraft-data')("1.16.5")

for (const blocksByNameKey in mcData.blocksByName) {
    console.log(mcData.blocksByName[blocksByNameKey].name)
}

console.log(mcData.blocksByName["oak_wood"].id)