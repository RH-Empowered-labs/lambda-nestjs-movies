import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service'

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}
    @Get('/popular/:page?')
    findPopular(@Param('page') page: string): Promise<any> {
        return this.moviesService.findPopular(page)
    }
}
