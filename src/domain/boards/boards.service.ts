import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { BoardPost } from './entities/board-post.entity';
import { CreateBoardPostDto } from './dto/create-post.dto';
import { UpdateBoardPostDto } from './dto/update-post.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import * as bcrypt from 'bcrypt';
import { CheckMyPostDto } from './dto/check-my-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import { createHash } from 'crypto';

@Injectable()
export class BoardsService {
    private checkedPost: BoardPost[] = [];

    constructor(
        @InjectRepository(BoardPost)
        private boardPostRepository: Repository<BoardPost>,
        @InjectRepository(Board)
        private boardRepository: Repository<Board>,
    ) { }

    /**
     * get all boards
     * @returns Array<Board>
     */
    async getBoardAll(): Promise<Board[]> {
        return this.boardRepository.find();
    }
    /**
     * get boardPost detail
     * @param boardId
     * @returns Board
     */
    getBoardOne(boardId: number): Promise<Board | null> {
        return this.boardRepository.findOneByOrFail({ id: boardId });
    }

    /**
     * create board
     * @param boardDto
     * @returns Board
     */
    async createBoard(boardDto: CreateBoardDto): Promise<Board> {
        const board = this.boardRepository.create(
            {
                ...boardDto,
            }
        );
        return this.boardRepository.save(board);
    }

    /**
     * get all boardPosts
     * @param boardId
     * @returns Array
     */
    async getBoardPostAll(boardId: number): Promise<BoardPost[]> {
        return this.boardPostRepository.find({
            where: {
                boardId: boardId,
            },
            select: ['id', 'title', 'writer', 'registDate']
        });
    }

    /**
     * get boardPost detail
     * @param session
     * @param id
     * @returns BoardPost
     */
    async getBoardPostOne(id: number): Promise<BoardPost | null> {
        const boardPost = await this.boardPostRepository.createQueryBuilder('board_post').where('board_post.id = :id', { id })
            .select(['board_post.id', 'board_post.title', 'board_post.contents', 'board_post.writer', 'board_post.regist_date'])
            .getOne();
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
        const boardPost = await this.boardPostRepository.findOneBy({ id: id });
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
    async deleteBoardPostOne(id: number): Promise<DeleteResult> {
        await this.getBoardPostOne(id);
        return await this.boardPostRepository.delete(id);
    }



    /**
     * create boardPost
     * @param boardPostData
     * @returns BoardPost
     */
    async createBoardPost(boardPostData: CreateBoardPostDto): Promise<BoardPost> {

        // this.getBoardOne(boardPostData.boardId);
        // const { boardId, title, contents, passwd, writer, registDate } = boardPostData;
        // const hashedPasswd = await bcrypt.hash(passwd, 10);
        // const newPost = {
        //     boardId, title, contents,
        //     passwd: hashedPasswd,
        //     writer, registDate
        // }
        let dataObj = null;
        for (let index = 0; index < 1000; index++) {
            // const hashedPasswd = await bcrypt.hash(faker.internet.password(), 1);
            const hash = createHash('sha256');
            hash.update(faker.internet.password());
            const newPost = this.boardPostRepository.create({
                boardId: 1,
                title: faker.commerce.productName(),
                writer: faker.person.fullName(),
                contents: faker.commerce.productDescription(),
                passwd: hash.digest('hex'),
                registDate: format(faker.date.past(), 'yyyy-MM-dd HH:mm:ss')
            });


            const boardPost = this.boardPostRepository.create(newPost);
            let dataObj = await this.boardPostRepository.save(boardPost);

        }
        // const hashedPasswd = await bcrypt.hash(faker.internet.password(), 10);
        // const newPost = this.boardPostRepository.create({
        //     boardId: 1,
        //     title: faker.commerce.productName(),
        //     writer: faker.person.fullName(),
        //     contents: faker.commerce.productDescription(),
        //     passwd: hashedPasswd,
        //     registDate: format(faker.date.past(), 'yyyy-MM-dd HH:mm:ss')
        // });


        // const boardPost = this.boardPostRepository.create(newPost);
        return dataObj;
    }

    /**
     * update boardPost
     * @param id
     * @param boardPostData
     * @returns BoardPost
     */
    async updateBoardPost(id: number, boardPostData: UpdateBoardPostDto): Promise<BoardPost> {
        const boardPost = await this.getBoardPostOne(id);

        const { boardId, title, contents, passwd, writer, registDate } = boardPostData;
        let newPost = {
            boardId, title, contents,
            writer, registDate, passwd
        }

        if (passwd) {
            const hashedPasswd = await bcrypt.hash(passwd, 10);
            newPost.passwd = hashedPasswd;
        } else {
            delete newPost.passwd;
        }
        await this.boardPostRepository.update(id, { ...boardPost, ...newPost });
        return this.boardPostRepository.findOneBy({ id: id });
    }
}
