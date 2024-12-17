import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Faker, faker } from '@faker-js/faker';
import { BoardPost } from '../domain/boards/entities/board-post.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { format } from 'date-fns';

@Injectable()
export class SeederService {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        @InjectRepository(BoardPost)
        private boardPostRepository: Repository<BoardPost>,
    ) { }


    // 더미 데이터를 생성하는 메서드
    async generateBoardPost(count: number): Promise<void> {
        this.logger.log(`Creating ${count} fake users...`);

        for (let i = 0; i < count; i++) {
            const hashedPasswd = await bcrypt.hash(faker.internet.password(), 10);
            const data = this.boardPostRepository.create({
                boardId: 1,
                title: faker.commerce.productName(),
                writer: faker.person.fullName(),
                contents: faker.commerce.productDescription(),
                passwd: hashedPasswd,
                registDate: format(faker.date.past(), 'yyyy-MM-dd HH:mm:ss')
            });
            await this.boardPostRepository.save(data);
        }

        this.logger.log(`${count} fake users created successfully!`);
    }
}
