import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import {toArabic} from "typescript-roman-numbers-converter"

export class VersionGroupController {
    static async update(url:string =`https://pokeapi.co/api/v2/version-group` ):Promise <null> {
    await prisma.$connect()
    let dataAll = await (await fetch(url)).json()
        
    const fetcher = async(path:string) => {
        let response = await fetch(path);
        return await response.json()
    }
    let fetchVers = []
    for (let versionGroup of dataAll.results){
        fetchVers.push( fetcher(versionGroup.url))
    }
    let versions = await Promise.all(fetchVers)
    let saveData = async(data_versionGroup:any)=>{
        let dataToUpload ={
            id: data_versionGroup.id,
            name: data_versionGroup.name,
            generation: toArabic(data_versionGroup.generation.name.split("-")[1])||0,
            versions: data_versionGroup.versions.map((version:any) => version.name),
            order: data_versionGroup.order
        }
        await prisma.versionGroup.upsert({
            where: {id: dataToUpload.id},
            update: dataToUpload,
            create: dataToUpload
        })
    }
    console.log(url)
    await Promise.all(versions.map(saveData))
    await prisma.$disconnect()
            
    if(dataAll.next){
        this.update(dataAll.next)
    }
        return null
    }
    
}