import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiService } from 'src/api/api.service';
import { DynamodbModule } from 'src/dynamodb/dynamodb.module';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';
import { CreateFavoriteMovieDTO, CreateMovieDTO, createMovieNoteDTO, movieNoteBodyDTO } from './dtos/movies-dto';

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

    async createFavoriteMovie(movieId: string, userId: string, movieNoteBody: movieNoteBodyDTO): Promise<any> {
        const movieKey = {
            PK: `#MOVIE#${movieId}`,
            SK: '#MOVIE#META',
        }

        try {
            const existMovie = await this.getMovieExistByMovieId(movieId);

            if (!existMovie) {

                let movieDetails = await this.apiService.findById(movieId);

                const movieItem: CreateMovieDTO = {
                    PK: `#MOVIE#${movieDetails.id}`,
                    SK: '#MOVIE#META',
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
                
                await this.dynamoService.putItem(this.dynamoDBTableName, movieItem);
            }

            const existFavorite = await this.getFavoriteMovieExistByMovieIdAndUserId(userId, movieId);
            

            if(!existFavorite) {
                const favoriteMovieItem: CreateFavoriteMovieDTO = {
                    PK: `#USER#${userId}`,
                    SK: `#FAVORITEMOVIE#${movieId}`,
                    userId: userId,
                    movieId: movieId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                await this.dynamoService.putItem(this.dynamoDBTableName, favoriteMovieItem);
            }

            const noteKey = {
                PK: `#USER#${userId}`,
                SK: `#MOVIENOTE#${movieId}`,
            }

            const existNote = await this.getMovieNoteExistByMovieIdAndUserId(movieId, userId);

            if(!existNote){
                const noteItem = {
                    PK: `#USER#${userId}`,
                    SK: `#MOVIENOTE#${movieId}`,
                    userId: userId,
                    movieId: movieId,
                    noteTitle: movieNoteBody.noteTitle,
                    description: movieNoteBody.description,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                await this.dynamoService.putItem(this.dynamoDBTableName, noteItem);
            }

            const movieFromDb = await this.dynamoService.getItemByKey(this.dynamoDBTableName, movieKey);
            console.log(movieFromDb);
            const movieNoteFromDb = await this.dynamoService.getItemByKey(this.dynamoDBTableName, noteKey);

            return {
                movie: {...movieFromDb},
                note: {...movieNoteFromDb}
            }

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }

    async getFavoriteMovie(movieId: string, userId: string): Promise<any> {
        const movieKey = {
            PK: `#MOVIE#${movieId}`,
            SK: '#MOVIE#META',
        }

        try {

        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }

    async getFavoriteMovies(userId: string, limit: number): Promise<any> {
        let startKey: undefined | any;

        const favoriteFilter = {
            PK: `#USER#${userId}`,
            SK: `#FAVORITEMOVIE#`,
        }


        try {
            const favoriteMovies: any = await this.dynamoService.queryItemsByPKAndSK(this.dynamoDBTableName, limit, favoriteFilter.PK, favoriteFilter.SK);
            
            if(favoriteMovies.items.length <= 0){
                return [];
            }

            const movieIds = favoriteMovies.items.map(item => item.movieId);
            
            const movieKeys = movieIds.map(id => ({
                PK: `#MOVIE#${id}`,
                SK: '#MOVIE#META',
            }));
            
            const moviesResponse = await this.dynamoService.batchGetItems(this.dynamoDBTableName, movieKeys);

            return moviesResponse
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }

    // internal functions
    private async getMovieExistByMovieId(id: string): Promise<boolean | Error> {
        const key = {
            'PK': `#MOVIE#${id}`,
            'SK': '#MOVIE#META',
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

    private async getFavoriteMovieExistByMovieIdAndUserId(
        movieId: string, 
        userId: string
    ): Promise<boolean | Error> {
        const key = {
            'PK': `#USER#${userId}`,
            'SK': `#FAVORITEMOVIE#${movieId}`,
        }

        try {
            const favoriteMovieFinder = await this.dynamoService.getItemByKey(this.dynamoDBTableName, key);

            if (!favoriteMovieFinder) {
                return false;
            }

            return true;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }

    }

    private async getMovieNoteExistByMovieIdAndUserId(
        movieId: string, 
        userId: string
    ): Promise<boolean | Error> {
        const key = {
            'PK': `#USER#${userId}`,
            'SK': `#MOVIENOTE#${movieId}`,
        }

        try {
            const movieNoteFinder = await this.dynamoService.getItemByKey(this.dynamoDBTableName, key);

            if (!movieNoteFinder) {
                return false;
            }

            return true;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }
}
