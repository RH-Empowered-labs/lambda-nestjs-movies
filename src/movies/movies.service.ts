import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';

@Injectable()
export class MoviesService {
    // dynamo table
    private dynamoDBTableName: string;

    constructor(
        private apiService: ApiService,
    ) {}

    async findPopular(page: string): Promise<any> {
        let movies = await this.apiService.moviePopular(page);
        return movies;
    }

    async findDetailsById(id: string): Promise <any> {
        let movieDetails = await this.apiService.findById(id);
        return movieDetails;
    }

    async createFavoriteMovie(movieId: string, userId: string): Promise<any>{

    }
}
