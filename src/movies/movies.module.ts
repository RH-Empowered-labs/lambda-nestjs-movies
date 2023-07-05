import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ApiModule } from '../api/api.module';
import { JwtStrategy } from '../auth/jwt.strategy';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';

@Module({
    imports: [
        ApiModule,
        DynamodbModule
    ],
    controllers: [MoviesController],
    providers: [MoviesService, JwtStrategy]
})
export class MoviesModule { }
