import { Controller, Get, Param, Post } from '@nestjs/common';
import { MoviesService } from './movies.service'

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}
    @Get('/popular/:page?')
    findPopular(@Param('page') page: string): Promise<any> {
        return this.moviesService.findPopular(page)
    }
    
    @Get('/details/:id?')
    findDetailsOfMovie(@Param('id') id: string): Promise<any> {
        return this.moviesService.findDetailsById(id)
    }
    
    @Post('/favorite/:id?')
    createFavoriteMovie(@Param('id') id: string): Promise<any> {
        return this.moviesService.createFavoriteMovie(id, '1');
    }
}
