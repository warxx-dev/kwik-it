import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { generateCode } from '../../utils';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';
import { PrismaService } from '../../prisma.service';
import { Link, Prisma } from '../../generated/prisma/client';

@Injectable()
export class LinkService {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredAnonymousLinks() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    await this.prisma.link.deleteMany({
      where: {
        user: null,
        createdAt: { lt: oneDayAgo },
      },
    });
  }

  async getAllLinksByEmail(email: string): Promise<Link[]> {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const links = await this.prisma.link.findMany({
        where: { userEmail: normalizedEmail },
      });
      console.log(`Found ${links.length} links for email: ${normalizedEmail}`);
      return links;
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async getLinkByCode(code: string): Promise<Link> {
    try {
      const link = await this.prisma.link.findUnique({
        where: { code },
      });
      if (!link) {
        throw new NotFoundException(
          `The link with the code ${code} is not found!`,
        );
      }
      return link;
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async createLink({
    data,
    email,
  }: {
    data: Prisma.LinkCreateInput;
    email: string;
  }): Promise<Link> {
    try {
      let { originalUrl, code } = data;

      if (!originalUrl.startsWith('http'))
        originalUrl = 'https://' + originalUrl;

      let generatedCode: string;
      if (!code || code.length === 0) {
        generatedCode = generateCode(5);
        let link = await this.prisma.link.findUnique({
          where: { code: generatedCode },
        });
        while (link) {
          generatedCode = generateCode(5);
          link = await this.prisma.link.findUnique({
            where: { code: generatedCode },
          });
        }
        code = generatedCode;
      }
      if (email) {
        const normalizedEmail = email.trim().toLowerCase();
        const link = await this.prisma.link.create({
          data: {
            originalUrl,
            code,
            user: { connect: { email: normalizedEmail } },
          },
        });
        if (!link) {
          throw new InternalServerErrorException('Link could not be created');
        }
        return link;
      } else {
        const link = await this.prisma.link.create({
          data: {
            originalUrl,
            code,
          },
        });
        if (!link) {
          throw new InternalServerErrorException('Link could not be created');
        }
        return link;
      }
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async updateLink(
    id: number,
    { code, originalUrl }: Prisma.LinkUpdateInput,
  ): Promise<Link> {
    try {
      const linkToUpdate = await this.prisma.link.findUnique({
        where: { id },
      });

      if (!linkToUpdate) {
        throw new NotFoundException('Link not found');
      }

      const linkUpdated = await this.prisma.link.update({
        where: { id },
        data: { originalUrl, code },
      });

      if (!linkUpdated) {
        throw new InternalServerErrorException('Failed to update link');
      }

      return linkUpdated;
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async removeLink(id: number): Promise<string> {
    try {
      const link = await this.prisma.link.findUnique({
        where: { id },
      });

      if (!link) {
        throw new NotFoundException('Link not found');
      }

      await this.prisma.link.delete({
        where: { id },
      });

      const deletedLink = await this.prisma.link.findUnique({
        where: { id },
      });

      if (!deletedLink) {
        return 'Link deleted successfully';
      }

      throw new InternalServerErrorException(
        'Error occurred while deleting link',
      );
    } catch (error) {
      throw new InternalServerErrorException(error as Error);
    }
  }

  async incrementClicks(link: Link): Promise<void> {
    link.clicks += 1;
    await this.prisma.link.update({
      where: { id: link.id },
      data: { clicks: link.clicks },
    });
  }
}
