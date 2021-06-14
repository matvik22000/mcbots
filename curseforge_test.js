const curseforge = require("mc-curseforge-api");
const strComp = require("string-similarity");
const fs = require("fuzzyset.js");
const fileSys = require("fs");
const mods_requered = ["ivtoolkit",
    "micdoodlecore",
    "smoothfontcore",
    "bnbgamingcore",
    "foamfixcore",
    "randompatches",
    "movillages",
    "charcoalblock",
    "crafttweaker"
    , "mtlib"
    , "modtweaker"
    , "jei"
    , "abyssalcraft"
    , "chisel"
    , "mantle"
    , "twilightforest"
    , "tconstruct"
    , "acintegration"
    , "fastbench"
    , "actuallyadditions"
    , "baubles"
    , "actuallybaubles"
    , "animalium"
    , "antiqueatlas"
    , "base"
    , "contenttweaker"
    , "immersiveengineering"
    , "geolosys"
    , "buildcraftlib"
    , "buildcraftcore"
    , "cyclicmagic"
    , "redstoneflux"
    , "mekanism"
    , "natura"
    , "traverse"
    , "betterwithmods"
    , "appleskin"
    , "appliedenergistics2"
    , "armoreablemobs"
    , "aroma1997core"
    , "astikorcarts"
    , "astralsorcery"
    , "tombstone"
    , "quark"
    , "autoreglib"
    , "bdlib"
    , "betterwithaddons"
    , "betterbedrock"
    , "betterbuilderswands"
    , "betterwithlib"
    , "bibliocraft"
    , "waila"
    , "modularrouters"
    , "guideapi"
    , "bloodmagic"
    , "bnbgaminglib"
    , "bonsaitrees"
    , "bookshelf"
    , "bringbedrockback"
    , "buildcraftbuilders"
    , "buildcraftfactory"
    , "buildcraftrobotics"
    , "buildcrafttransport"
    , "buildcraftsilicon"
    , "buildinggadgets"
    , "car"
    , "gamestages"
    , "carryon"
    , "cd4017be_lib"
    , "ceramics"
    , "chameleon"
    , "chargers"
    , "chiselsandbits"
    , "clumps"
    , "codechickenlib"
    , "cyclopscore"
    , "commoncapabilities"
    , "refinedstorage"
    , "compactmachines3"
    , "conarm"
    , "cookingforblockheads"
    , "crafttweakerjei"
    , "cucumber"
    , "darkutils"
    , "death_compass"
    , "despawningspawners"
    , "dimensionalcontrol"
    , "dimstages"
    , "dungpipe"
    , "elevatorid"
    , "emberroot"
    , "enderstorage"
    , "enderutilities"
    , "valkyrielib"
    , "environmentaltech"
    , "extendedcrafting"
    , "galacticraftcore"
    , "galacticraftplanets"
    , "mjrlegendslib"
    , "extraplanets"
    , "farmingforblockheads"
    , "farseek"
    , "fastfurnace"
    , "fat_cat"
    , "ferdinandsflowers"
    , "findme"
    , "foamfix"
    , "forgelin"
    , "forgemultipartcbe"
    , "microblockcbe"
    , "minecraftmultipartcbe"
    , "galacticrafttweaker"
    , "advgenerators"
    , "gobblecore"
    , "harvest"
    , "horsepower"
    , "huntingdim"
    , "igwmod"
    , "mcjtylib_ng"
    , "immcraft"
    , "immersivepetroleum"
    , "immersivetech"
    , "improvedbackpacks"
    , "incontrol"
    , "indlog"
    , "teslacorelib"
    , "industrialforegoing"
    , "infoaccessories"
    , "integrateddynamics"
    , "integrateddynamicscompat"
    , "inventorytweaks"
    , "ironbackpacks"
    , "ironchest"
    , "ironjetpacks"
    , "itemstages"
    , "journeymap"
    , "jarm"
    , "jaff"
    , "jeid"
    , "kleeslabs"
    , "lex"
    , "lttweaker"
    , "magma_monsters"
    , "mekatweaks"
    , "mercurius"
    , "mobends"
    , "mob_grinding_utils"
    , "mobstages"
    , "modularmachinery"
    , "morpheus"
    , "mputils"
    , "mpbasic"
    , "multiblockstages"
    , "mundaneredstone"
    , "mysticalagriculture"
    , "mysticalagradditions"
    , "mystagradcompat"
    , "naturescompass"
    , "nex"
    , "noworldgen5you"
    , "nutrition"
    , "samsocean"
    , "oreexcavation"
    , "oeintegration"
    , "orestages"
    , "overloaded"
    , "pickletweaks"
    , "placebo"
    , "playerbosses"
    , "playerskins"
    , "pneumaticcraft"
    , "poweradapters"
    , "prestige"
    , "primalchests"
    , "rustic"
    , "thebetweenlands"
    , "primal"
    , "progressiontweaks"
    , "prospectors"
    , "reborncore"
    , "quantumstorage"
    , "quickleafdecay"
    , "rangedpumps"
    , "realdrops"
    , "rebornstorage"
    , "recipestages"
    , "reccomplex"
    , "refinedstorageaddons"
    , "rftools"
    , "rftoolscontrol"
    , "roadrunner"
    , "scannable"
    , "sevpatches"
    , "sevtweaks"
    , "sev_tweaks_npc"
    , "simpleautorun"
    , "simplegenerators"
    , "storagenetwork"
    , "simplyarrows"
    , "spartanshields"
    , "spatialservermod"
    , "stevescarts"
    , "stg"
    , "storagedrawers"
    , "streams"
    , "sasit"
    , "supersoundmuffler"
    , "tallgates"
    , "beneath"
    , "thirstybottles"
    , "tcomplement"
    , "tinkerstages"
    , "tinkertoolleveling"
    , "togetherforever"
    , "totemic"
    , "tothebatpoles"
    , "translocators"
    , "triumph"
    , "trumpetskeleton"
    , "tumbleweed"
    , "uppers"
    , "universalmodifiers"
    , "vc"
    , "vtt"
    , "waddles"
    , "wailastages"
    , "walljump"
    , "wanionlib"
    , "watercontrolextreme"
    , "waterstrainer"
    , "wawla"
    , "weirdinggadget"
    , "wildcrops"
    , "witherskelefix"
    , "wopper"
    , "xnet"
    , "ynot"
    , "yoyos"
    , "zenstages"
    , "zenloot"
    , "primal_tech"
    , "teslacorelib_registries"]

const version = "1.12.2";
const mods_lst = [];

// for (let i = 0; i < mods.length; i++) {
//     console.log(mods[i]);
//     curseforge.getMods({searchFilter: mods[i]}).then((mods) => {
//         console.log(mods);
//     });
// }


class ModInfo {
    constructor(mod) {
        this.name = mod.name
        this.url = mod.url
        this.name_from_url = this.url.slice(this.url.lastIndexOf("/"))
        this.key = mod.key
    }

}

let set_names
let set_urls
let set_keys

async function quickSearch(mods_required) {
    let mods_successful = []
    let mods_failed = []
    let promises = []
    let data = await fileSys.promises.readFile('mod_dict.json')
    data = JSON.parse(data)
    for (let i = 0; i < mods_required.length; i++) {
        if (data.hasOwnProperty(mods_required[i])){
            console.log(mods_required[i])
            promises.push(curseforge.getMods({searchFilter: data[mods_required[i]]}))
        } else {
            promises.push(curseforge.getMods({searchFilter: mods_required[i]}))
        }
    }
    let mods_found = await Promise.all(promises)
    // [[{name: mod1}, {name:mod2}], [{}], ...]
    for (let i = 0; i < mods_found.length; i++) {
        if (mods_found[i].length === 0) {
            mods_failed.push(mods_required[i])
        } else {
            // mods_found[i].map(mod => mods_successful.push(mod))
            mods_successful.push(mods_found[i][0])
        }
    }
    return {success: mods_successful, fail: mods_failed}

}

async function long_search(mods_required) {
    console.log("starting long search")
    let mods_downloaded = await curseforge.getMods({gameVersion: version, pageSize: 10000})
    for (let i = 0; i < mods_downloaded.length; i++) {
        mods_lst.push(new ModInfo(mods_downloaded[i]))
    }

    set_names = fs(mods_lst.map(x => x.name))
    set_urls = fs(mods_lst.map(x => x.name_from_url))
    set_keys = fs(mods_lst.map(x => x.key))

    for (let i = 0; i < mods_required.length; i++) {
        let found = getMod(mods_required[i])
        // console.log(found)
        // console.log()
        if (found.prob < 0.75) {
            console.log(found)
            console.log()
        }
    }
}

function getMod(name) {
    let matches = []
    let names = set_names.get(name)
    let urls = set_urls.get(name)
    let keys = set_keys.get(name)
    if (names !== null) matches.push(names[0])
    if (urls !== null) matches.push(urls[0])
    if (keys !== null) matches.push(keys[0])
    let bestMatch = [-1, ""]
    //[
    //   [ [ 0.36363636363636365, 'Controlling' ] ],
    //   [ [ 0.33333333333333337, '/controlling' ] ],
    //   [ [ 0.36363636363636365, 'controlling' ] ]
    // ]
    for (let i = 0; i < matches.length; i++) {
        if (matches[i][0] > bestMatch[0]) {
            bestMatch = matches[i]
        }
    }
    // console.log(name, bestMatch)
    for (let i = 0; i < mods_lst.length; i++) {
        if (mods_lst[i].name === bestMatch[1] || mods_lst[i].key === bestMatch[1] || mods_lst[i].name_from_url === bestMatch[1]) {
            return {required: name, found: mods_lst[i].name, prob: bestMatch[0]}
        }
    }

}

quickSearch(mods_requered)
    .then(res => {
        for (let i = 0; i < res.success.length; i++) {
            console.log(res.success[i].name)
        }
        if (res.fail.length !== 0) {
            // long_search(res.fail).then(res => console.log(res))
        }
    })

