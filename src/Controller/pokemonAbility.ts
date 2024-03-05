import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class pokemonAbility {
    static async update(url:string= "https://pokeapi.co/api/v2/pokemon"):Promise <null> {
        // This is a placeholder for the actual implementation
        fetch(url).then(async(response) => response.json()).then((data) => {
            Promise.all(data.results.map(async(pokemon:any) => {
                fetch(pokemon.url).then(async(response) => response.json()).then((data) => {
                    Promise.all(
                        data.abilities.map(async (ability:any) => {
                            try{
                                await prisma.pokemonAbility.create({data: {
                                    pokemonId: data.id,
                                    abilityId: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/","")),
                                    generation: "last"
                                }});
                                // await prisma.pokemon.update({where: {id: data.id}, data: {
                                //     abilities: {connect: {
                                //         id: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/",""))
                                //     }}
                                // }})
                            }catch(e){
                                console.log("-----")
                                console.log("FAIL")
                                console.log("pokemon "+data.name)
                                console.log("ability "+ability.ability.name)


                            }
                        })
                    )
                })
            }))
            return (data)
        })
        .then((data) => {
            if(data.next){
                return pokemonAbility.update(data.next)
            }
        })
        return null
    }
}
//id: Number(ability.ability.url.match("/[0-9]+/")[0].replaceAll("/",""))
//