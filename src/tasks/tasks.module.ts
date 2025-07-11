import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { FeedbackService } from 'src/feedback/feedback.service';

@Module({
  imports: [PrismaModule, FeedbackModule],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
