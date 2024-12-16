import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { BoardPost } from './entities/board-post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Board, BoardPost])],
    exports: [TypeOrmModule],
    controllers: [BoardsController],
    providers: [BoardsService]
})
export class BoardsModule { }
