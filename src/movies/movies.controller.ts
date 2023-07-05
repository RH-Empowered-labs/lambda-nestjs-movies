import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service'
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/popular/:page?')
    findPopular(@Param('page') page: string): Promise<any> {
        return this.moviesService.findPopular(page)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/details/:id?')
    findDetailsOfMovie(@Param('id') id: string): Promise<any> {
        return this.moviesService.findDetailsById(id)
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('/favorite/:id?')
    createFavoriteMovie(@Param('id') id: string): Promise<any> {
        return this.moviesService.createFavoriteMovie(id, '1');
    }
}
