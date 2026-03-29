import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto, UpdateLinkDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Link } from 'src/generated/prisma/client';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async find(@Query('email') email: string): Promise<Link[]> {
    if (!email) {
      throw new NotFoundException('Email query parameter is required.');
    }
    const normalizedEmail = email
      .replace(/^"+|"+$/g, '')
      .trim()
      .toLowerCase();
    if (!normalizedEmail) {
      throw new BadRequestException('Email query parameter is invalid.');
    }
    console.log(`Fetching links for email: ${normalizedEmail}`);
    return await this.linkService.getAllLinksByEmail(normalizedEmail);
  }

  @Get(':code')
  @UseGuards(JwtAuthGuard)
  async findByCode(@Param('code') code: string): Promise<Link> {
    return await this.linkService.getLinkByCode(code);
  }

  @Post()
  async create(@Body() body: CreateLinkDto): Promise<Link> {
    const { originalLink, code, email } = body;
    return await this.linkService.createLink({
      data: { originalLink, code },
      email,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateLinkDto,
  ): Promise<Link> {
    const { code, originalLink } = body;
    return await this.linkService.updateLink(id, {
      code,
      originalLink,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: number): Promise<string> {
    return await this.linkService.removeLink(id);
  }
}
