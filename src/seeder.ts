import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeederModule);
    const seederService = app.get(SeederService);
    console.time('generateBoardPost');
    // 예시: 20명의 더미 사용자 생성
    await seederService.generateBoardPost(100);

    console.timeEnd('generateBoardPost');
    await app.close();
}

bootstrap()
    .then(() => console.log('Seeder execution completed!'))
    .catch((err) => {
        console.error('Seeder execution failed', err);
        process.exit(1);
    });