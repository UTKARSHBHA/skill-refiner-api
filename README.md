# Skill Refiner API

This is a NestJS backend project powered by Prisma and PostgreSQL.  
It allows users to submit resumes, receive GenAI-powered feedback, and view task history.

## Stack:
- NestJS (TypeScript)
- PostgreSQL (via Docker)
- Prisma ORM
- OpenAI GPT for feedback generation

## Getting Started:
- `npm install`
- Set up `.env` with your `DATABASE_URL` and `OPENAI_API_KEY`
- Run `npx prisma migrate dev`
- Start with `npm run start:dev`

