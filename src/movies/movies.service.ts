import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/api/api.service';

@Injectable()
export class MoviesService {
    // dynamo table
    private dynamoDBTableName: string;

    constructor(
        private apiService: ApiService,
    ) {}

    findPopular(page: string): any {
        let movies = this.apiService.moviePopular(page);
        return movies;
    }
}
