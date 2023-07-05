import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiService } from 'src/api/api.service';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { CreateMovieDTO, createMovieNoteDTO } from './dtos/movies-dto';

@Injectable()
export class MoviesService {
    // dynamo table
    private dynamoDBTableName: string;

    constructor(
        private configService: ConfigService,
        private apiService: ApiService,
        private dynamoService: DynamodbService,
    ) {
        this.dynamoDBTableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
    }

    async findPopular(page: string): Promise<any> {
        let movies = await this.apiService.moviePopular(page);
        return movies;
    }

    async findDetailsById(id: string): Promise<any> {
        let movieDetails = await this.apiService.findById(id);
        return movieDetails;
    }

    async createFavoriteMovie(movieId: string, userId: string): Promise<any> {
        const movieKey = {
            'PK': '#MOVIE#META',
            'SK': `#MOVIE#ID#${movieId}`
        }

        try {
            const existMovie = await this.getMovieExistByMovieId(movieId);

            if (!existMovie) {

                let movieDetails = await this.apiService.findById(movieId);

                const movieItem: CreateMovieDTO = {
                    PK: '#MOVIE#META',
                    SK: `#MOVIE#ID#${movieDetails.id}`,
                    movieId: movieDetails.id,
                    movieImDbId: movieDetails.imdb_id,
                    language: movieDetails.original_language,
                    genres: movieDetails.genres,
                    title: movieDetails.original_title,
                    overview: movieDetails.overview,
                    popularity: movieDetails.popularity,
                    posterPath: movieDetails.poster_path,
                    releaseDate: movieDetails.release_date,
                    video: movieDetails.video,
                    voteAverage: movieDetails.vote_average,
                    voteCount: movieDetails.vote_count,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                console.log('creando pelicula');
                await this.dynamoService.putItem(this.dynamoDBTableName, movieItem);
                const existMovie = await this.dynamoService.getItemByKey(this.dynamoDBTableName, movieKey);
                return existMovie;
            }

            console.log('devolviendo pelicula existente en db');
            return await this.dynamoService.getItemByKey(this.dynamoDBTableName, movieKey);



        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }


    private async getMovieExistByMovieId(id: string): Promise<boolean | Error> {
        const key = {
            'PK': '#MOVIE#META',
            'SK': `#MOVIE#ID#${id}`
        }

        try {
            const movieFinder = await this.dynamoService.getItemByKey(this.dynamoDBTableName, key);

            if (!movieFinder) {
                return false;
            }

            return true;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }

    }
}
