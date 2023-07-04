import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { response } from 'express';

import { CreateMovieDTO } from 'src/movies/dtos/movies-dto';

const axios = require('axios').default;


@Injectable()
export class ApiService {

    // Api
    private apiURLString: string;
    private apiURLVersion: string;
    private apiKey: string;
    private apiCompleteURL: string;
    private apiKeyString: string;

    // Logger
    private readonly logger = new Logger(ApiService.name);

    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {
        // get strings of variables
        this.apiURLString = this.configService.get<string>('MOVIES_API_URL_STRING');
        this.apiURLVersion = this.configService.get<string>('MOVIES_API_URL_VERSION');
        this.apiKey = this.configService.get<string>('MOVIES_API_KEY');
        
        // create strings to merge strings
        this.apiCompleteURL = this.apiURLString + '/' + this.apiURLVersion
        this.apiKeyString = '?api_key=' + this.apiKey
    }

    async moviePopular(page: string): Promise<any> {
        const apiUrl = this.apiCompleteURL + '/movie/popular' + this.apiKeyString + '&page=' + page
        const { data } = await axios.get(apiUrl);
        return data;
    }
}
