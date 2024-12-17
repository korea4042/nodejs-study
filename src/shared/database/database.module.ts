import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `src/configs/env/.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql', // 데이터베이스 종류 (mysql, postgres 등)
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || 'Q!w2e3r4',
            database: process.env.DB_NAME || 'clicknapi',
            entities: [__dirname + '/../../domain/**/entities/*.entity.{js,ts}'], // 엔티티 파일 경로
            namingStrategy: new SnakeNamingStrategy(),
            synchronize: false, // 스키마 자동 동기화 여부 (운영환경에서는 false)
            logging: false, // 쿼리 로깅 활성화
        }),
    ],

})
export class DatabaseModule { }