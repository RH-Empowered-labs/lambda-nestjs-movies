import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
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
    
    @UseGuards(JwtAuthGuard)
    @Put('/favorite/:id?')
    async updateFavoriteMovieNote(
        @Body() movieNoteBody: movieNoteBodyDTO,
        @Param('id') id: string, 
        @Req() req,
    ): Promise<any> {
        const movie = await this.moviesService.updateMovieNote(
            id, 
            req.user.id,
            movieNoteBody
        );
        console.log(movie);
        return movie
    }

    @UseGuards(JwtAuthGuard)
    @Get('/favorite/:id?')
    async getFavoriteMovie(
        @Param('id') id: string, 
        @Req() req,
    ): Promise<any> {
        const movie = await this.moviesService.getFavoriteMovie(
            id, 
            req.user.id
        );
        console.log(movie);
        return movie
    }

    @UseGuards(JwtAuthGuard)
    @Get('/favorites')
    async getFavoriteMovies(
        @Req() req,
    ): Promise<any> {
        const limit = 10;
        return await this.moviesService.getFavoriteMovies(
            req.user.id,
            limit
        );
    }
}
