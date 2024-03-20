import { PrismaClient, Target } from '@prisma/client'
import { resolve } from 'path'
import { toArabic } from 'typescript-roman-numbers-converter'
import pokemonController from './pokemon'
import { MechanicController } from './mechanic'
const prisma = new PrismaClient()

export class MoveController {
    static async update(url:string = `https://pokeapi.co/api/v2/move`):Promise <null> {
        await prisma.$connect()
        await prisma.mechanic.deleteMany({where: {moveId: {not: null}}})
        let dataAll = await (await fetch(url)).json()
        const fetcher = async(path:string) => {
            let response = await fetch(path);
            return await response.json()
        }
        let fetchAbili = []
        for (let move of dataAll.results){
            fetchAbili.push( fetcher(move.url))
        }
        let moves = await Promise.all(fetchAbili)
        let saveData = async(move:any) => {
            let flavor_text_base = move.flavor_text_entries.filter((item:any) => {item.language.name == "en"})
            let effect_base = move.effect_entries.filter((item:any) => {item.language.name == "en"})
            
            let effect =null, flavor_text = null, short_effect = null
            if (effect_base.length > 0){
                effect = effect_base[0].effect
                short_effect = effect_base[0].short_effect
            }
            if (flavor_text_base.length > 0){
                flavor_text = flavor_text_base[0].flavor_text
            }
            let contestEffectId = null
            if(move.contest_effect){

                contestEffectId = Number(move.contest_effect.url.match('\/[0-9]+\/')[0].replaceAll("/",""))
            }
            if(move.flavor_text_entries){
                let tmp = move.flavor_text_entries.filter((item:any)=>item.language.name=="en")
                if (tmp.length > 0){
                    flavor_text = tmp[0].flavor_text.replaceAll("\n"," ")
                }
            }
            let moveToAdd ={
                ///
                id:move.id,
                name:move.name,
                generation: (toArabic(move.generation.name.split("-")[1])||0),
                flavorText: flavor_text,
                effect: effect,
                power: move.power,
                priority: move.priority,
                accuracy: move.accuracy,
                type: move.type.name,
                damageClass: move.damage_class.name,
                target: move.target.name,
                pp: move.pp,
                statChanges: move.stat_changes,
                pastValues: move.past_values,
                effectChance: move.effect_chance,
                effectEntries: effect,  
                shortEffect: short_effect,  
                effectChanges: move.effect_changes,
                contestCombo: move.contest_combos,
                contestEffectId: contestEffectId,
                contestType: move.contest_type?move.contest_type.name:null,
                metaAilment: move.meta?move.meta.ailment.name:null,
                metaAilmentChance: move.meta?move.meta.ailment_chance:null,
                metaCategory: move.meta? move.meta.category.name:null,
                metaCritRate: move.meta?move.meta.crit_rate:null,
                metaDrain: move.meta?move.meta.drain:null,
                metaFlinchChance: move.meta?move.meta.flinch_chance:null,
                metaHealing: move.meta?move.meta.healing:null,
                metaMaxHits: move.meta?move.meta.max_hits:null,
                metaMaxTurns: move.meta?move.meta.max_turns:null,
                metaMinHits: move.meta?move.meta.min_hits:null,
                metaMinTurns: move.meta?move.meta.min_turns:null,
                metaStatChance: move.meta?move.meta.stat_chance:null
            }
            await prisma.move.upsert({
                where: {id: move.id},
                update: moveToAdd,
                create: moveToAdd
            })
            
            for (let index = 0; index < move.stat_changes.length; index++) {
                const element = move.stat_changes[index];
                element.stat.name
                element.change
                let target1:any = await prisma.effect.findUnique({where: {name: `stats-${element.stat.name}`}})
                let target2:any = await prisma.effect.findUnique({where: {name: `stats`}})
                let target3:any
                

                if(element.change>0){
                    target3 = await prisma.effect.findUnique({where: {name: `power-up`}})
                }else{
                    target3 = await prisma.effect.findUnique({where: {name: `power-down`}})
                }
                if(!target1 || !target2 || !target3){
                    console.log(`stats-${element.stat.name}`)
                    throw new Error("Target not found")
                }
                // create mechanic with moveId data.id and using target, target2 and target3
                await prisma.mechanic.create({
                    data:{
                        moveId:move.id,
                        effects:{
                            create: [
                                {effect:{connect: {id: target1.id}}},
                                {effect:{connect: {id: target2.id}}},
                                {effect:{connect: {id: target3.id}}}
                            ]
                        }
                    }
                })
            }
        }
        await Promise.all(moves.map(saveData))
        await prisma.$disconnect()
        console.log(url)
        if(dataAll.next){
            await this.update(dataAll.next)
        }
        return null
    }
    static async getAll(req: any, res: any) {
        let result
        try{
            await prisma.$connect()
            let filter = JSON.parse(req.query.filter || "{}")
            let where = {}

            Object.keys(filter).map((key) => {

                if(!Object.keys(prisma.move.fields).includes(key)) return null
                switch (filter[key].type){
                    case "value":
                        where = {...where, [key]:{
                            gte: filter[key].value[0]?filter[key].value[0]:0,
                            lte: filter[key].value[1]?filter[key].value[1]:255
                        }}
                        break;
                    case "ids":
                        console.log(Object.entries(filter[key])[1][1])
                        
                         where = filter[key].value.length>0 ? 
                             {...where, [key]:{in: Object.entries(filter[key])[1][1]}}:
                             {...where};
                         break;
                    }
                })
            
            result = await prisma.move.findMany({where:where})
            return res.json(result)
        }catch(error){
            console.log(error)
            return res.json([])
        }
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
    static async getCategories(req: any, res: any) {
        await prisma.$connect()
        const result = await prisma.move.findMany({select: {metaCategory:true},distinct: ['metaCategory']})
        await prisma.$disconnect()
        return res.json(result.map((item:any) => item.metaCategory))
    }

}
