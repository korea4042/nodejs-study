import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { BoardPost } from '../domain/boards/entities/board-post.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../shared/database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `src/configs/env/.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        }),
        DatabaseModule,
        SeederModule,
        TypeOrmModule.forFeature([BoardPost])
    ],
    providers: [SeederService],

})
export class SeederModule { }