import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import *as cookieParser from 'cookie-parser';
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT || 3000
    app.setGlobalPrefix('api')
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());    

    await app.listen(+PORT, ()=> {
      console.log(`Bu projects ${+PORT}-chi portda ishga tushdi`);
    });
  
  } catch (error) {
    
  }
}
bootstrap();
