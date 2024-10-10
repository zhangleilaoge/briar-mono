import { Controller, Get, Param, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import * as fs from 'fs';
import { join } from 'path';

@Controller()
export class StaticController {
  private readonly briarPath = join(
    __dirname,
    '../../../../briar-frontend/dist/briar',
  );
  private readonly staticPath = join(
    __dirname,
    '../../../../briar-frontend/dist/static',
  );

  @Get('briar/*')
  async getBriar(@Param('0') path: string, @Res() reply) {
    const filePath = join(this.briarPath, path);
    return this.sendFile(reply, filePath);
  }

  @Get('static/*')
  async getStatic(@Param('0') path: string, @Res() reply) {
    const filePath = join(this.staticPath, path);
    return this.sendFile(reply, filePath);
  }

  private async sendFile(reply: FastifyReply, filePath: string) {
    try {
      // 检查文件是否存在
      if (fs.existsSync(filePath)) {
        return reply.sendFile(filePath); // Fastify 的 sendFile 方法
      } else {
        return reply.status(404).send('File not found');
      }
    } catch (error) {
      return reply.status(500).send('Error retrieving file');
    }
  }
}
