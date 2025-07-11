import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { FeedbackService } from 'src/feedback/feedback.service';
import { File } from 'multer';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly feedbackService: FeedbackService,
  ) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  getTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(
    @UploadedFile() file: File,
    @Body('email') userEmail: string,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }

    const buffer = file.buffer;

    let text = '';

    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      throw new BadRequestException('Unsupported file type');
    }

    const task = await this.tasksService.createTask({
      title: file.originalname,
      content: text,
      userEmail: userEmail || 'anonymous@demo.com',
    });

    const feedback = await this.feedbackService.generateFeedback(task.id);

    return {
      task,
      feedback,
    };
  }
}
