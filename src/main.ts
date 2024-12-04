import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true
        }),
    );

    app.use(
        session({
            secret: 'my-secret2',
            resave: true,
            saveUninitialized: true,
            cookie: {
                maxAge: 3600000, // 1시간 (밀리초 단위)
            },
        }),
    );

    await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
