import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ApiModule } from '../api/api.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [ApiModule],
    controllers: [MoviesController],
    providers: [MoviesService, JwtStrategy]
})
export class MoviesModule { }
