import { PrismaClient } from '@prisma/client'
import { AbilityController } from './Controller/ability'
import { MoveController } from './Controller/move'
import pokemonController from './Controller/pokemon'
import { VersionGroupController } from './Controller/versionGroup'
import { MechanicController } from './Controller/mechanic'
const ability_old = require("../backup/abilities.json")

const prisma = new PrismaClient()
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
    console.log("updating version groups...")
    await VersionGroupController.update()

    
    console.log("updating abilities...")
    await AbilityController.update()

    console.log("updating mechanics...")
    await MechanicController.update()

    console.log("updating moves...")
    await MoveController.update()

    console.log("updating pokemons...")
    await pokemonController.update()


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
    // AbilityController.findByMechanic({triggers:["full-hp","on-hit"],targets:[],effects:[]}).then((result:any) => {
    //     result.map((ability:any) => {
    //         console.log(ability)
    //         ability.pokemonsAbilities.map((pokemonAbility:any) => {
    //             console.log(pokemonAbility)
    //         })
    //     })
    // })
}
let main = async () => {
    populate()
}
main()
