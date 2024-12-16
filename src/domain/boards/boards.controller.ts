import { Controller, Get, Post, Param, Body, Delete, Patch } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateBoardPostDto } from './dto/create-post.dto';
import { UpdateBoardPostDto } from './dto/update-post.dto';
import { CheckMyPostDto } from './dto/check-my-post.dto';

@Controller('boards')
export class BoardsController {
    constructor(private readonly boardService: BoardsService) { }

    @Get()
    getBoardAll() {
        return this.boardService.getBoardAll();
    }

    @Post()
    createBoard(@Body() boardData: CreateBoardDto) {
        return this.boardService.createBoard(boardData);
    }

    @Get('/:boardId')
    getBoardPostAll(@Param('boardId') boardId) {
        return this.boardService.getBoardPostAll(boardId);
    }

    @Get('/:boardId/:id')
    getBoardPostOne(@Param('id') id) {
        return this.boardService.getBoardPostOne(id);
    }

    @Post('/:boardId/:id/check')
    checkMyPost(@Param('id') id, @Body() pwsswdData: CheckMyPostDto) {
        return this.boardService.checkMyPost(id, pwsswdData);
    }

    @Post('/:boardId')
    createBoardPost(@Body() postData: CreateBoardPostDto) {
        return this.boardService.createBoardPost(postData);
    }

    @Patch('/:boardId/:id')
    updateBoardPost(@Param('id') id, @Body() postData: UpdateBoardPostDto) {
        return this.boardService.updateBoardPost(id, postData);
    }

    @Delete('/:boardId/:id')
    deleteBoardPost(@Param('id') id) {
        this.boardService.deleteBoardPostOne(id);
    }
}
