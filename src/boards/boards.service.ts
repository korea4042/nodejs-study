import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { BoardPost } from './entities/board-post.entity';
import { CreateBoardPostDto } from './dto/create-post.dto';
import { UpdateBoardPostDto } from './dto/update-post.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import * as bcrypt from 'bcrypt';
import { CheckMyPostDto } from './dto/check-my-post.dto';
import { SessionData } from 'express-session';

@Injectable()
export class BoardsService {
    private boardPosts: BoardPost[] = [];
    private boards: Board[] = [];
    private checkedPost: BoardPost[] = [];

    /**
     * get all boards
     * @returns Array<Board>
     */
    getBoardAll(): Board[] {
        return this.boards;
    }

    /**
     * get all boardPosts
     * @param boardId
     * @returns Array
     */
    getBoardPostAll(boardId: number) {
        const posts = this.boardPosts.filter((boardPost) => boardPost.boardId = boardId).map(post => ({
            title: post.title,
            writer: post.writer,
            registDate: post.registDate
        }));

        return posts
    }

    /**
     * get boardPost detail
     * @param boardId
     * @returns Board
     */
    getBoardOne(boardId: number): Board {
        const board = this.boards.find((board) => board.id == boardId);
        if (!board) {
            throw new NotFoundException(`Board with ID ${boardId} not found`);
        }
        return board;
    }

    /**
     * get boardPost detail
     * @param session
     * @param id
     * @returns BoardPost
     */
    getBoardPostOne(id: number): BoardPost {
        const boardPost = this.boardPosts.find((boardPost) => boardPost.id == id);
        if (!boardPost) {
            throw new NotFoundException(`BoardPost with ID ${id} not found`);
        }

        const matchItem = this.checkedPost.filter(function (boardPost) {
            return id == boardPost.id
        });

        if (matchItem.length === 0) {
            throw new ForbiddenException("BoardPost is Access denied");
        }

        return boardPost;
    }

    /**
     * check my post
     * @param id
     * @param checkMyPostDto
     */
    async checkMyPost(id: number, checkMyPostDto: CheckMyPostDto): Promise<void> {
        const boardPost = this.boardPosts.find((boardPost) => boardPost.id == id);
        if (!boardPost) {
            throw new NotFoundException(`BoardPost with ID ${id} not found`);
        }

        const isMatch = await bcrypt.compare(checkMyPostDto.passwd, boardPost.passwd);
        if (isMatch) {
            this.checkedPost.push(boardPost);
        } else {
            throw new ForbiddenException("BoardPost is Access denied");
        }
    }

    /**
     * delete boardPost
     * @param id 
     */
    deleteBoardPostOne(id: number): void {
        this.boardPosts = this.boardPosts.filter(function (boardPost) {
            return id != boardPost.id
        });
    }

    /**
     * create board
     * @param boardDto
     * @returns Board
     */
    createBoard(boardDto: CreateBoardDto): Board {
        this.boards.push({
            id: this.boards.length + 1,
            ...boardDto,
        });

        return [...this.boards].pop();
    }

    /**
     * create boardPost
     * @param boardPostData
     * @returns BoardPost
     */
    async createBoardPost(boardPostData: CreateBoardPostDto): Promise<BoardPost> {

        this.getBoardOne(boardPostData.boardId);
        const { boardId, title, contents, passwd, writer, registDate } = boardPostData;
        const hashedPasswd = await bcrypt.hash(passwd, 10);
        const newPost = {
            id: this.boardPosts.length + 1,
            boardId, title, contents,
            passwd: hashedPasswd,
            writer, registDate
        }
        this.boardPosts.push(newPost);
        return [...this.boardPosts].pop();
    }

    /**
     * update boardPost
     * @param id
     * @param boardPostData
     * @returns BoardPost
     */
    updateBoardPost(id: number, boardPostData: UpdateBoardPostDto): Promise<BoardPost> {
        const boardPost = this.getBoardPostOne(id);
        this.deleteBoardPostOne(id);
        return this.createBoardPost({ ...boardPost, ...boardPostData });
    }
}
