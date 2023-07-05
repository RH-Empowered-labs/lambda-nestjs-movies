import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service'
import { JwtAuthGuard } from '../auth/auth.guard';
import { movieNoteBodyDTO } from './dtos/movies-dto';

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
        @Body() movieNoteBody: movieNoteBodyDTO,
        @Param('id') id: string, 
        @Req() req,
    ): Promise<any> {
        const movie = await this.moviesService.createFavoriteMovie(
            id, 
            req.user.id,
            movieNoteBody
        );
        console.log(movie);
        return movie
    }
}
