import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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
        console.log(apiUrl);
        try {
            const { data } = await axios.get(apiUrl);
            return data;
        } catch (error) {
            this.logger.error({
                Title: 'Error API get service',
                Error: `[${error.message}]`
            });
            return error
        }
    }

    async findById(id: string): Promise<any> {
        const apiUrl = this.apiCompleteURL + '/movie/' + id + this.apiKeyString
        try {
            const { data } = await axios.get(apiUrl);
            return data;
        } catch (error) {
            this.logger.error({
                Title: 'Error API get service',
                Error: `[${error.message}]`
            });
            return error
        }
    }
}
