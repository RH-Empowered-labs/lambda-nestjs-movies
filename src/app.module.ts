import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { MoviesModule } from './movies/movies.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ApiModule,
    MoviesModule,
    DynamodbModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
