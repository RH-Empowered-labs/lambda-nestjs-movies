import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ApiModule } from '../api/api.module';

@Module({
    imports: [ApiModule],
    controllers: [MoviesController],
    providers: [MoviesService]
})
export class MoviesModule { }
