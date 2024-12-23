import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsController } from './domain/boards/boards.controller';
import { BoardsService } from './domain/boards/boards.service';
import { BoardsModule } from './domain/boards/boards.module';
import { DatabaseModule } from './shared/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SeederService } from './seeder/seeder.service';
import { SeederModule } from './seeder/seeder.module';

console.log(process.env);

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `src/configs/env/.${process.env.NODE_ENV}.env`,
            isGlobal: true,
        }),
        DatabaseModule,
        BoardsModule,
        SeederModule,
    ],
    controllers: [AppController],
    providers: [AppService, SeederService],
})
export class AppModule { }
