import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service'
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('movies')
export class MoviesController {
    constructor(private moviesService: MoviesService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/popular/:page?')
    findPopular(
        @Param('page') page: string,
        @Req() req
    ): Promise<any> {
        return this.moviesService.findPopular(page)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/details/:id?')
    findDetailsOfMovie(
        @Param('id') id: string,
        @Req() req    
    ): Promise<any> {
        return this.moviesService.findDetailsById(id)
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('/favorite/:id?')
    async createFavoriteMovie(
        @Param('id') id: string, 
        @Req() req
    ): Promise<any> {
        const movie = await this.moviesService.createFavoriteMovie(id, req.user.id);
        console.log(movie);
        return movie
    }
}
