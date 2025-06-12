import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule } from '@nestjs/axios';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  imports: [
    HttpModule, // <- también asegúrate de importar esto
    PokemonModule, // 👈 Esto permite que @InjectModel(Pokemon.name) funcione en SeedService
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
