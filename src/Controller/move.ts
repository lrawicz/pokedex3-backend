import { PrismaClient } from '@prisma/client'
import { resolve } from 'path'
import { toArabic } from 'typescript-roman-numbers-converter'
const prisma = new PrismaClient()

export class MoveController {
    static async update(url:string = `https://pokeapi.co/api/v2/move`):Promise <null> {
        await prisma.$connect()
        console.log(url)
        fetch(url)
            .then((response) => response.json())
            .then(async(data) => {
                await Promise.all(data.results.map(async(move:any) => {
                    fetch(move.url)
                        .then((response) => response.json())
                        .then( async(data) => {
                            let flavor_text_base = data.flavor_text_entries.filter((item:any) => {item.language.name == "en"})
                            let effect_base = data.effect_entries.filter((item:any) => {item.language.name == "en"})
                            
                            let effect =null, flavor_text = null, short_effect = null
                            if (effect_base.length > 0){
                                effect = effect_base[0].effect
                                short_effect = effect_base[0].short_effect
                            }
                            if (flavor_text_base.length > 0){
                                flavor_text = flavor_text_base[0].flavor_text
                            }
                            let contestEffectId = null
                            if(data.contest_effect){

                                contestEffectId = Number(data.contest_effect.url.match('\/[0-9]+\/')[0].replaceAll("/",""))
                            }
                            
                            let moveToAdd ={
                                ///
                                id:data.id,
                                name:data.name,
                                generation: (toArabic(data.generation.name.split("-")[1])||0),
                                flavorText: flavor_text,
                                effect: effect,
                                power: data.power,
                                priority: data.priority,
                                accuracy: data.accuracy,
                                type: data.type.name,
                                damageClass: data.damage_class.name,
                                target: data.target.name,
                                pp: data.pp,
                                statChanges: data.stat_changes,
                                pastValues: data.past_values,
                                effectChance: data.effect_chance,
                                effectEntries: effect,  
                                shortEffect: short_effect,  
                                effectChanges: data.effect_changes,
                                contestCombo: data.contest_combos,
                                contestEffectId: contestEffectId,
                                contestType: data.contest_type?data.contest_type.name:null,
                                metaAilment: data.meta?data.meta.ailment.name:null,
                                metaAilmentChance: data.meta?data.meta.ailment_chance:null,
                                metaCategory: data.meta? data.meta.category.name:null,
                                metaCritRate: data.meta?data.meta.crit_rate:null,
                                metaDrain: data.meta?data.meta.drain:null,
                                metaFlinchChance: data.meta?data.meta.flinch_chance:null,
                                metaHealing: data.meta?data.meta.healing:null,
                                metaMaxHits: data.meta?data.meta.max_hits:null,
                                metaMaxTurns: data.meta?data.meta.max_turns:null,
                                metaMinHits: data.meta?data.meta.min_hits:null,
                                metaMinTurns: data.meta?data.meta.min_turns:null,
                                metaStatChance: data.meta?data.meta.stat_chance:null
                            }
                            await prisma.move.upsert({
                                where: {id: data.id},
                                update: moveToAdd,
                                create: moveToAdd
                            })
                        })
                }))
                return data
            }).then((data) => {
                if(data.next!= null) this.update(data.next)
            })
        return null
    }
    static async getAll(req: any, res: any) {
        await prisma.$connect()
        const result = await prisma.move.findMany()
        await prisma.$disconnect()
        return res.json(result)
    }
    static async getDamageClass(req: any, res: any) {
        await prisma.$connect()
        const result = await prisma.move.findMany({select: {damageClass:true},distinct: ['damageClass']})
        await prisma.$disconnect()
        return res.json(result.map((item:any) => item.damageClass))
    }
    static async getTargetTypes(req: any, res: any) {
        await prisma.$connect()
        const result = await prisma.move.findMany({select: {target:true},distinct: ['target']})
        await prisma.$disconnect()
        return res.json(result.map((item:any) => item.target))
    }
    static async getAilments(req: any, res: any) {
        await prisma.$connect()
        const result = await prisma.move.findMany({select: {metaAilment:true},distinct: ['metaAilment']})
        await prisma.$disconnect()
        return res.json(result.map((item:any) => item.metaAilment))
    }
}
