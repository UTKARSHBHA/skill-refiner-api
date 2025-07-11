import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}
  
  private openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'SkillRefinerAI'
    }
  });
  

  async generateFeedback(taskId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
  
    if (!task) throw new NotFoundException('Task not found');
  
    const prompt = `You are an expert resume coach. Provide specific feedback on this resume content:\n\n"${task.content}"`;
  
    const completion = await this.openai.chat.completions.create({
      model: 'meta-llama/llama-3.3-70b-instruct:free',
      messages: [{ role: 'user', content: prompt }],
    });
  
    const aiContent = completion.choices[0].message?.content?.trim();
  
    if (!aiContent) {
      throw new InternalServerErrorException('AI returned no feedback. Please try again.');
    }
  
    const savedFeedback = await this.prisma.feedback.create({
      data: {
        content: aiContent,
        task: { connect: { id: taskId } },
      },
    });
  
    return {
      message: 'Feedback generated and saved',
      feedback: savedFeedback,
    };
  }
  
}
