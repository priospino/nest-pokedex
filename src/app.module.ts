import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';



@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema
    }),//necesario para cargar las variables de entorno
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
    }),
    
    MongooseModule.forRoot(process.env.MONGODB || 'mongodb://localhost:27017/nest-pokemon'),

    PokemonModule,
    CommonModule,
    SeedModule

  ]
})
export class AppModule {

  constructor(){
    //console.log( process.env ) //para ver todas las variables de entorno
    console.log('MongoDB URI:', process.env.MONGODB);
    const port = process.env.PORT || 3000;
    console.log(`🚀 App running on http://localhost:${port}`);
  }

}
