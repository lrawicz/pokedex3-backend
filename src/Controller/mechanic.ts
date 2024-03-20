import { Ability, PrismaClient, Trigger, Target, Effect } from '@prisma/client'
import { toArabic } from 'typescript-roman-numbers-converter'
const prisma = new PrismaClient()
import { Request, Response } from 'express'
export class MechanicController {
    

  async create(req: Request, res: Response) {
    // ...
  }
  public static async update() {
    await prisma.$connect()
    let ability_old = require("../../backup/abilities.json")
    //drop DB
    await prisma.mechanic.deleteMany()
    for (let index = 0; index < Object.keys(ability_old).length; index++) {
        
        console.log(Math.floor(index/ Object.keys(ability_old).length*100)+"%");
        const ability = ability_old[Object.keys(ability_old)[index]];
        let dataToUpload: any = {}
        for (let index = 0; index < ability["mechanics"].length; index++) {
            let  mechanic_raw = ability["mechanics"][index];
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

            await prisma.mechanic.create({
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
    await prisma.$disconnect()
    }
 public static async getTriggers   (req: Request, res: Response, next: any)  {
    try{
        const result:Trigger[] = await prisma.trigger.findMany()
        return res.json(result)
    }catch(error){
        return res.json([])
    }
}
public static async getTargets   (req: Request, res: Response)  {
    try{
        const result:Target[] = await prisma.target.findMany()
        return res.json(result)
    }catch(error){
        return res.json([])
    }
}
public static async getEffects   (req: Request, res: Response)  {
    const result:Effect[] = await prisma.effect.findMany()
    return res.json(result)
}
}   