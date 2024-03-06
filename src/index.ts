import { PrismaClient } from '@prisma/client'
import { create } from 'domain'
import internal from 'stream'
import { AbilityController } from './Controller/ability'
import { MoveController } from './Controller/move'
import { VersionGroupController } from './Controller/versionGroup'
import { pokemonAbility } from './Controller/pokemonAbility'
import pokemonController from './Controller/pokemon'
const ability_old = require("../data_raw/abilities.json")

const prisma = new PrismaClient()
let populatePokemon = async () => {

    await prisma.$connect()
    //drop DB
    // load files in pokemons folder
    const fs = require('fs')
    const path = require('path')
    const folder = path.join(__dirname, '../data_raw/pokemons')
    const files = fs.readdirSync(folder)
    // import pokemons
    for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const pokemon = require(`../data_raw/pokemons/${file}`)
        try{

         await prisma.pokemon.create({data: {
            id: pokemon.id,
            name: pokemon.name,
            type1: pokemon.types[0]?pokemon.types[0]:null,
            type2: pokemon.types[1]?pokemon.types[1]:null,
            hp: pokemon.stats.hp,
            attack: pokemon.stats.attack,
            defense: pokemon.stats.defense,
            specialAttack: pokemon.stats["special-attack"],
            specialDefense: pokemon.stats["special-defense"],
            speed: pokemon.stats.speed,
            generation: pokemon.generation,

            weight: pokemon.weight,
            height: pokemon.height,
            color: pokemon.color,
            isBaby: pokemon.is_baby,
            isLegendary: pokemon.is_legendary,
            isMythical: pokemon.is_mythical,
            growthRate: pokemon.growth_rate,
            habitat: pokemon.habitat,

            abilities: {
                create:
                await Promise.all(pokemon.abilities.map(async(ability:any) => {
                    let ab = await prisma.ability.findUnique({where: {name: ability.name}})
                    if (ab){
                        return {ability:{connect: {id: ab.id}}, generation: "last"}
                    }else{
                        console.log(`habilidad ${ability.name} no encontrada`)
                        return {ability:{connect: {id: null}}, generation: "last"}
                    }
                }))
            },
        }})
        }
        catch(e){
            console.log(e)
        }

    }


    await prisma.$disconnect()
}
let populateAbilities = async () => {
    await prisma.$connect()
    //drop DB
    
    // import abilities.json
    for(let key in ability_old){
        let ability = await prisma.ability.findUnique({where: {id: ability_old[key].id}})
        if(!ability){
            ability = await prisma.ability.create({data: {
                id: ability_old[key].id,
                name: ability_old[key].name,
                flavor_text: ability_old[key].flavor_text,
                generation: ability_old[key].generation,
            }})
        }
        for (let index = 0; index < ability_old[key]["mechanics"].length; index++) {
            let  mechanic_raw = ability_old[key]["mechanics"][index];
            let triggers = []
            for (let index = 0; index < mechanic_raw.trigger.length; index++) {
                let trigger = await prisma.trigger.findUnique({where: {name: mechanic_raw.trigger[index]}})
                if(!trigger){
                    trigger = await prisma.trigger.create({data: {name: mechanic_raw.trigger[index]}})
                }
                triggers.push(trigger)
            }
            let targets = []
            for (let index = 0; index < mechanic_raw.target.length; index++) {
                let target = await prisma.target.findUnique({where: {name: mechanic_raw.target[index]}})
                if(!target){
                    target = await prisma.target.create({data: {name: mechanic_raw.target[index]}})
                }
                targets.push(target)
            }

            let effects = []
            for (let index = 0; index < mechanic_raw.effect.length; index++) {
                let effect = await prisma.effect.findUnique({where: {name: mechanic_raw.effect[index]}})
                if(!effect){
                    effect = await prisma.effect.create({data: {name: mechanic_raw.effect[index]}})
                }
                effects.push(effect)
            }

            let mechanic = await prisma.mechanic.create({
                data:{
                    abilityId:ability.id,
                    triggers:{
                        create: triggers.map((trigger) => ({trigger:{connect: {id: trigger.id}}}))
                    },
                    targets:{
                        create: targets.map((target) => ({target:{connect: {id: target.id}}}))
                    },
                    effects:{
                        create: effects.map((effect) => ({effect:{connect: {id: effect.id}}}))
                    }
                }
            })
        }
    }
    prisma.$disconnect
}
let find = async ({triggers=[],targets=[],effects=[]}:{triggers?:String[],targets?:String[],effects?:String[]}) => {
    await prisma.$connect()
    let trigger_query = triggers.map((trigger) => {
        return `SELECT a.id from "MechanicsTriggers" me
        INNER JOIN "Trigger" t  ON t.id  = me."triggerId"  
        INNER JOIN "Mechanic" m  ON m.id  = me."mechanicId" 
        INNER JOIN "Ability" a  ON m."abilityId"  = a.id  
        WHERE t.name = '${trigger}'
        GROUP BY a.id`
    })
    let target_query = targets.map((target) => {
        return `SELECT a.id from "MechanicsTargets" me
        INNER JOIN "Target" t  ON e.id  = me."targetId"  
        INNER JOIN "Mechanic" m  ON m.id  = me."mechanicId" 
        INNER JOIN "Ability" a  ON m."abilityId"  = a.id  
        WHERE t.name = '${target}'
        GROUP BY a.id`
    })
    let effect_query = effects.map((effect) => {
        return `SELECT a.id from "MechanicsEffects" me
        INNER JOIN "Effect" e  ON e.id  = me."effectId"  
        INNER JOIN "Mechanic" m  ON m.id  = me."mechanicId" 
        INNER JOIN "Ability" a  ON m."abilityId"  = a.id  
        WHERE e.name = '${effect}'
        GROUP BY a.id`
    })
    let query = [...trigger_query,...target_query,...effect_query].join(" INTERSECT ")
    
    const result2:any[] = await prisma.$queryRawUnsafe(query)
    const abilitiesIds = result2.map((item) => item.id)
    let result = await prisma.ability.findMany({where: {id: {in: abilitiesIds}}})
    prisma.$disconnect
    console.log(result)
}
let showAbility = async (id:number) => {
    await prisma.$connect()
    let ability = await prisma.ability.findUnique(
        {where: {id: id},
        include: {mechanics: {include: {triggers: true, targets: true, effects: true}}}}
    )
    console.log(ability)
    prisma.$disconnect
}
let addStats = async () => {
    // load files in pokemons folder
    const fs = require('fs')
    const path = require('path')
    const folder = path.join(__dirname, '../data_raw/pokemons')
    const files = fs.readdirSync(folder)
    // import pokemons
    for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const pokemon = require(`../data_raw/pokemons/${file}`)
        let stats = {
            hp: pokemon.stats.hp,
            attack: pokemon.stats.attack,
            defense: pokemon.stats.defense,
            spAttack: pokemon.stats["special-attack"],
            spDefense: pokemon.stats["special-defense"],
            speed: pokemon.stats.speed,
        }
        await prisma.pokemon.update({where: {id: pokemon.id}, data: stats})
    
    }
}
let populate = async () => {
    await populateAbilities()
    await populatePokemon()
    console.log("FINISHED")
}

let populateMoves = async () => {
    await prisma.$connect()
    //drop DB
    // load files in moves folder
    const fs = require('fs')
    const path = require('path')
    const folder = path.join(__dirname, '../data_raw/pokemons')
    const files = fs.readdirSync(folder)
    // import moves
    for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const pokemon = require(`../data_raw/pokemons/${file}`)
        try{
            for (let index = 0; index < pokemon.moves.length; index++) {
                let move = pokemon.moves[index]
                delete move["versions"]
                let meta =[
                    "meta_ailment",
                    "meta_ailment_chance", 
                    "meta_category", 
                    "meta_crit_rate",
                    "meta_drain",
                    "meta_flinch_chance", 
                    "meta_healing", 
                    "meta_max_hits", 
                    "meta_max_turns", 
                    "meta_min_hits", 
                    "meta_min_turns", 
                    "meta_stat_chance",
                ]
                meta.map((key) => {
                    move[key] =move[key]==""? move[key]=null:move[key]
                })
                
                let moveDB  = await prisma.move.findUnique({where: {id: move.id}}) 
                if(!moveDB){
                    await prisma.move.create({data: move})
                }
            }
        }
        catch(e){
            console.log(e)
        }

    }
    await prisma.$disconnect()

}
let testFindAbility = async () => {
    AbilityController.findByMechanic({triggers:["full-hp","on-hit"],targets:[],effects:[]}).then((result:any) => {
        result.map((ability:any) => {
            console.log(ability)
            ability.pokemonsAbilities.map((pokemonAbility:any) => {
                console.log(pokemonAbility)
            })
        })
    })
}
let main = async () => {
    //await populateAbilities()
    //await showAbility(5)
    //await populatePokemon()
    //await populate()
//    await addStats()
//    prisma.
//    await find({triggers:["full-hp","on-hit"]})


    //populateMoves()
    //await MoveController.uploadDescriptions()
    
    // await AbilityController.updateMechanics("as-one-spectrier",[
    //     {triggers:["on-knock-out","on-hit"],targets:["self-stats"],effects:["stats-special-attack","power-up"]},
    //     {triggers:["opponents-use-item","item-berry"],targets:["opponents-item"],effects:["prevent-item-use"]},
    // ]
    // )
    
    //  let result = await AbilityController.getData("as-one-glastrier")
    //  console.log(result)


    //await populateAbilities()
    //
    //console.log(await AbilityController.abilitiesToFix())
    //await pokemonController.update()
//    let result = await pokemonController.getPokemon("suicune")
    //await VersionGroupController.update()
    await MoveController.update()
}
main()
