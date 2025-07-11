import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        content: createTaskDto.content,
        userEmail: createTaskDto.userEmail,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { feedbacks: true },
    });
  }

  async createTask(data: { title: string; content: string; userEmail: string }) {
    return this.prisma.task.create({ data });
  }
  
}
