import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { CreateLinkDto, UpdateLinkDto } from './dto';
import { Link } from './entities/link.entity';
import { LinkData } from './types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async find(@Query('email') email: string): Promise<Link[]> {
    if (!email) {
      throw new NotFoundException('Email query parameter is required.');
    }
    const result = await this.linkService.getLinks(email);
    return result.fold(
      (links) => {
        return links;
      },
      (error) => {
        if (typeof error === 'string') {
          if (error.includes('not found')) {
            throw new NotFoundException(error);
          }
          throw new InternalServerErrorException(error);
        }

        if (error instanceof Error) {
          throw new InternalServerErrorException(
            'Error retrieving links due to a system failure.',
          );
        }

        throw new InternalServerErrorException('An unknown error occurred.');
      },
    );
  }

  @Get('code/:code')
  @UseGuards(JwtAuthGuard)
  async findByCode(@Param('code') code: string): Promise<Link> {
    const result = await this.linkService.getLinkByCode(code);
    return result.fold(
      (link) => link,
      (error) => {
        if (typeof error === 'string') {
          if (error.includes('not found')) {
            throw new NotFoundException(error);
          }
          throw new InternalServerErrorException(error);
        }

        if (error instanceof Error) {
          throw new InternalServerErrorException(
            'Error retrieving link due to a system failure.',
          );
        }

        throw new InternalServerErrorException('An unknown error occurred.');
      },
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Link> {
    const result = await this.linkService.getLink(id);
    return result.fold(
      (link) => link,
      (error) => {
        if (typeof error === 'string') {
          if (error.includes('not found')) {
            throw new NotFoundException(error);
          }
          throw new InternalServerErrorException(error);
        }

        if (error instanceof Error) {
          throw new InternalServerErrorException(
            'Error retrieving link due to a system failure.',
          );
        }

        throw new InternalServerErrorException('An unknown error occurred.');
      },
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: CreateLinkDto): Promise<LinkData> {
    const { originalLink, code, email } = body;
    const result = await this.linkService.createLink({
      originalLink,
      code,
      email,
    });
    return result.fold(
      (link) => {
        return link;
      },
      (error) => {
        if (typeof error === 'string') {
          if (error.includes('not found')) {
            throw new NotFoundException(error);
          }
          throw new InternalServerErrorException(error);
        }

        if (error instanceof Error) {
          throw new InternalServerErrorException(
            'Error creating link due to a system failure.',
          );
        }

        throw new InternalServerErrorException('An unknown error occurred.');
      },
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateLinkDto,
  ): Promise<LinkData> {
    const { code, originalLink } = body;
    const result = await this.linkService.updateLink(id, {
      code,
      originalLink,
    });
    return result.fold(
      (link) => link,
      (error) => {
        if (typeof error === 'string') {
          if (error.includes('not found')) {
            throw new NotFoundException(error);
          }
          throw new InternalServerErrorException(error);
        }

        if (error instanceof Error) {
          throw new InternalServerErrorException(
            'Error updating link due to a system failure.',
          );
        }

        throw new InternalServerErrorException('An unknown error occurred.');
      },
    );
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('code') code: string): Promise<string> {
    const result = await this.linkService.removeLink(code);
    return result.fold(
      (link) => link,
      (error) => {
        if (typeof error === 'string') {
          if (error.includes('not found')) {
            throw new NotFoundException(error);
          }
          throw new InternalServerErrorException(error);
        }

        if (error instanceof Error) {
          throw new InternalServerErrorException(
            'Error deleting link due to a system failure.',
          );
        }

        throw new InternalServerErrorException('An unknown error occurred.');
      },
    );
  }
}
