import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [PrismaModule, TasksModule, FeedbackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
