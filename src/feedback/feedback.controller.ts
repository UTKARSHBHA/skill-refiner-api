import { Controller, Post, Param, Get, ParseIntPipe } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':taskId')
  generate(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.feedbackService.generateFeedback(taskId);
  }

  @Post(':taskId/retry')
  async retryFeedback(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.feedbackService.generateFeedback(taskId);
  }
}
