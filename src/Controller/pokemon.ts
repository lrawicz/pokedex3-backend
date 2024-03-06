import { PrismaClient } from "@prisma/client"
//let roman = require('roman-numbers')
import {toArabic} from "typescript-roman-numbers-converter"

const prisma = new PrismaClient()
export default  class pokemonController{
    static async update(url:string= "https://pokeapi.co/api/v2/pokemon"):Promise <null> {
        // This is a placeholder for the actual implementation
        fetch(url).then(async(response) => response.json()).then((data) => {
            Promise.all(data.results.map(async(pokemon:any) => {
                fetch(pokemon.url).then(async(response) => response.json()).then(async(data) => {
                    console.log(data.id)
                    let specie:any = await fetch(data.species.url).then(async(response) => response.json())
                    let abilityPokemon = data.abilities.map((ability:any) => {
                        return {
                            abilityId: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/","")),
                            generation: "last",
                            slot: ability.slot,
                            isHidden: ability.is_hidden 
                        }
                    })
                    data.past_abilities.map((meta_abilities:any) => {
                        let generation = meta_abilities.generation.name
                        meta_abilities.abilities.map((ability:any) => {
                            abilityPokemon.push({
                                abilityId: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/","")),
                                generation: generation,
                                slot: ability.slot,
                                isHidden: ability.is_hidden 
                            })
                        })
                    })
                    let moveLearns:any[] = []
                    data.moves.map((item:any) => {
                        let moveId = item.move.url.match("/[0-9]+/")[0].replaceAll("/","")
                        item.version_group_details.map((version:any) => {
                            moveLearns.push({
                                moveId: Number(moveId),
                                method: version.move_learn_method.name,
                                versionGroupId: Number(version.version_group.url.match("/[0-9]+/")[0].replaceAll("/","")),
                                level: version.level_learned_at
                            })
                        })
                    })
                    let pokeInDb = await prisma.pokemon.findUnique({where: {id: data.id}})
                        let dataToUpload = {
                            id:data.id,
                            name: data.name,
                            height: data.height,
                            weight: data.weight,
                            hp: data.stats[0].base_stat,
                            attack: data.stats[1].base_stat,
                            defense: data.stats[2].base_stat,
                            specialAttack: data.stats[3].base_stat,
                            specialDefense: data.stats[4].base_stat,
                            speed: data.stats[5].base_stat,
                            pastHabilities: data.past_abilities,
                            isBaby: specie.is_baby,
                            isLegendary: specie.is_legendary,
                            isMythical: specie.is_mythical,
                            genderRate: specie.gender_rate,
                            captureRate: specie.capture_rate,
                            specie: specie.name,
                            color: specie.color.name,
                            growthRate:specie.growth_rate.name,
                            habitat:specie.habitat?specie.habitat.name:null,
                            type1: data.types[0].type.name,
                            type2: data.types[1] ? data.types[1].type.name : null,
                            generation: specie.generation.name,
                            hasGenderDifferences: specie.has_gender_differences,
                            abilities: {create: abilityPokemon},
                            movesLearns: {create: moveLearns}
                        }
                        await prisma.pokemon.upsert({
                                where: {id: data.id},
                                update: dataToUpload,
                                create: dataToUpload
                        })
                })
            }))
            return (data)
        })
        .then((data) => {
            if(data.next){
                return pokemonController.update(data.next)
            }
        })
        return null
    }

    static async getPokemon(request:number|string, generation:string="generation-i"):Promise<any>{
        let pokemon:any;
        let where:any;
        where = isNaN(Number(request))? {name: String(request)}: {id: Number(request)};

        pokemon = await prisma.pokemon.findUnique({where: where, include: {abilities: {
            select: {
                ability: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                generation: true,
                slot: true,
                isHidden: true
            }
        
        }}})
        let arabic_request = generation.toLowerCase() == "last"? 99999:toArabic(generation.toLowerCase().split("-")[1])||0
        pokemon.abilities = {
            "slot-1": pokemon.abilities
                .filter((ability:any) => ability.slot == 1)
                .map((ability:any) => {
                    ability.generation = ability.generation == "last" ?"generation-xxx":ability.generation
                    ability.generation = toArabic(ability.generation.split("-")[1])||0
                    return (ability)})
                .sort((a:any,b:any) => {a.generation - b.generation})
                .reduce((acumulado:any, ability:any) => {
                    if(!acumulado){
                        return ability
                    }else{
                        return (arabic_request < ability.generation)?ability:acumulado
                    }
                },{}),
            "slot-2": pokemon.abilities
                .filter((ability:any) => ability.slot == 2)
                .map((ability:any) => {
                    ability.generation = ability.generation == "last" ?"generation-xxx":ability.generation
                    ability.generation = toArabic(ability.generation.split("-")[1])||0
                    return (ability)
                }).sort((a:any,b:any) => {a.generation - b.generation})
                .reduce((acumulado:any, ability:any) => {
                    if(!acumulado){
                        return ability
                    }else{
                        return (arabic_request < ability.generation)?ability:acumulado
                    }
                },{}),
            "slot-3": pokemon.abilities
                    .filter((ability:any) => ability.slot == 3)
                    .map((ability:any) => {
                        ability.generation = ability.generation == "last" ?"generation-xxx":ability.generation
                        ability.generation = toArabic(ability.generation.split("-")[1])||0
                        return (ability)
                    }).sort((a:any,b:any) => {
                        a.generation - b.generation
                    }).reduce((acumulado:any, ability:any) => {
                        if(!acumulado){
                            return ability
                        }else{
                            return (arabic_request < ability.generation)?ability:acumulado
                        }
                    },{})
        }
        console.log(pokemon.abilities["slot-1"])
        return pokemon
    }
}
