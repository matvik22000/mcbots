const curseforge = require("mc-curseforge-api");
// const fs = require("fs");
// fs.readFile('mods.js', (e, data) => {
//     let s = JSON.parse(data)
//
//     for (let i = 0; i < s.length; i++) {
//         if (s[i].key === "foamdix-optimisation-mod") {
//             print(s[i])
//         }
//
//     }
// })

curseforge.getMods({searchFilter: "Tinkers Construct"}).then((mods) => {
    console.log(mods[0])
})
