import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit : number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,

  ) {
    //console.log("DEFAULT_LIMIT:", process.env.DEFAULT_LIMIT);
    this.defaultLimit = configService.get<number>('defaultLimit')??10;
    //console.log("defaultLimit:", this.defaultLimit )
  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      this.handleExceptions( error );
    }
    
  }

  async findAll() {
    try {
      const pokemons = await this.pokemonModel.find().sort({ no: 1 }); // Ordena por número ascendente
      return pokemons;
    } catch (error) {
        this.handleExceptions(error);
    }
  }


 /**
 * Obtiene una lista paginada de pokemones desde la base de datos.
 * 
 * @param paginationDto - Objeto con parámetros de paginación: limit y offset.
 * @returns Lista de pokemones paginada, ordenada por número (no).
 */
async findAllPaginado(paginationDto: PaginationDto) {

  //const { limit = 10, offset = 0 } = paginationDto;
  const { limit = this.defaultLimit, offset = 0 } = paginationDto;

  return this.pokemonModel
    .find()                          // Busca todos los documentos
    .limit(limit)                    // Límite de resultados por página
    .skip(offset)                    // Salto de documentos para paginación
    .sort({ no: 1 })                 // Orden ascendente por número
    .select('-__v');                 // Excluye el campo __v de Mongoose
}





  async findOne(term: string) {
    
    let pokemon: Pokemon | null = null;

  
    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoID
    if ( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }


    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);
    

    return pokemon;
  }


    async update( term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );
    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);


    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto };
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove( id: string) {

    if ( !isValidObjectId( id ) ) {
      throw new InternalServerErrorException(`id is invalid`);
    }

    const result = await this.pokemonModel.deleteOne({ _id: id });
    if ( result.deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);

    return;
  }


  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }


  




}
