import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardsController } from './domain/boards/boards.controller';
import { BoardsService } from './domain/boards/boards.service';
import { BoardsModule } from './domain/boards/boards.module';
import { DatabaseModule } from './shared/database/database.module';

@Module({
    imports: [
        BoardsModule,
        DatabaseModule, 
    ],
    controllers: [AppController, BoardsController],
    providers: [AppService, BoardsService],
})
export class AppModule { }
