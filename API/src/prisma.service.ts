import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from './generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
    super({ adapter, log: ['error'] });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
