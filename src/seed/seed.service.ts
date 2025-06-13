import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';


@Injectable()
export class SeedService {

  // Inyectamos dos dependencias:
  // 1. El modelo de Pokémon para guardar datos en MongoDB.
  // 2. El servicio HTTP para hacer peticiones a la PokeAPI.
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    //private readonly http: HttpService,
    private readonly http: AxiosAdapter,
  ) {}

  
  // Método principal que pobla la base de datos con Pokemones.
  async executeSeed() {

     // Paso 1: Eliminar todos los Pokemones existentes en la colección.
    await this.pokemonModel.deleteMany(); 

    // Paso 2: Hacer una petición HTTP a la API de Pokemones.
    // Se utiliza firstValueFrom para convertir el Observable en una Promesa.
    /*const { data } = await firstValueFrom(
      this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650'),
    );*/
     const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    // Paso 3: Transformar la data recibida para insertar en MongoDB.
    const pokemonToInsert = data.results.map(({ name, url }) => {
      // Extraemos el número del Pokémon desde la URL.
      const no = +url.split('/').at(-2)!;
      return { name, no };
    });

    // Paso 4: Insertar todos los Pokemones en la base de datos.
    await this.pokemonModel.insertMany(pokemonToInsert);

    console.log('Seed Executed')

    // Paso 5: Retornar un mensaje de éxito.
    return 'Seed Executed';
  }
  
}
