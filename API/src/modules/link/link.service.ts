import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkDto, UpdateLinkDto } from './dto';
import { Repository, LessThan, IsNull } from 'typeorm';
import { Link } from './entities/link.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateCode, Result } from '../../utils';
import { LinkData, LinkError } from './types';
import { UserService } from '../user/user.service';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { CronExpression } from '@nestjs/schedule/dist/enums/cron-expression.enum';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link) private readonly linkRepository: Repository<Link>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanExpiredAnonymousLinks() {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    await this.linkRepository.delete({
      user: IsNull(),
      createdAt: LessThan(oneDayAgo),
    });
  }

  async getLinks(email: string): Promise<Result<Link[], LinkError>> {
    try {
      const links = await this.linkRepository.find({
        where: { user: { email } },
      });
      return Result.success(links);
    } catch (e) {
      return Result.failure(e as Error);
    }
  }
  async getLink(id: number): Promise<Result<Link, LinkError>> {
    try {
      const link = await this.linkRepository.findOne({ where: { id } });

      if (!link) {
        return Result.failure(`Link #${id} not found`);
      }
      return Result.success(link);
    } catch (error) {
      return Result.failure(error as Error);
    }
  }

  async getLinkByCode(code: string): Promise<Result<Link, LinkError>> {
    try {
      const link = await this.linkRepository.findOne({ where: { code } });
      if (!link) {
        return Result.failure(`The link with the code ${code} is not found!`);
      }
      return Result.success(link);
    } catch (error) {
      return Result.failure(error as Error);
    }
  }

  async createLink(
    linkData: CreateLinkDto,
  ): Promise<Result<LinkData, LinkError>> {
    try {
      let { originalLink, code } = linkData;
      const { email } = linkData;

      if (!originalLink.startsWith('http'))
        originalLink = 'https://' + originalLink;

      let generatedCode: string;
      if (!code || code.length === 0) {
        generatedCode = generateCode(5);
        let linkResult = await this.getLinkByCode(generatedCode);
        while (linkResult.isSuccess) {
          generatedCode = generateCode(5);
          linkResult = await this.getLinkByCode(generatedCode);
        }
        code = generatedCode;
      }
      if (email) {
        const userResult = await this.userService.findByEmail(email);
        return await userResult.fold(
          async (user) => {
            await this.linkRepository.save({ originalLink, code, user });
            return Result.success({ originalLink, code });
          },
          // eslint-disable-next-line @typescript-eslint/require-await
          async (error) => {
            if (typeof error === 'string')
              return Result.failure<LinkData, LinkError>(error);
            return Result.failure<LinkData, LinkError>(error);
          },
        );
      } else {
        await this.linkRepository.save({ originalLink, code });
        return Result.success({ originalLink, code });
      }
    } catch (error) {
      return Result.failure(error as Error);
    }
  }

  async updateLink(
    id: number,
    { code, originalLink }: UpdateLinkDto,
  ): Promise<Result<LinkData, LinkError>> {
    try {
      const linkToUpdate = await this.linkRepository.findOne({ where: { id } });

      if (!linkToUpdate) return Result.failure('Link not found');

      await this.linkRepository.update(id, {
        originalLink,
        code,
      });

      const linkUpdated = await this.linkRepository.findOne({ where: { id } });

      if (!linkUpdated) {
        return Result.failure('Updated link could not be retrieved');
      }

      return Result.success({
        originalLink: linkUpdated.originalLink,
        code: linkUpdated.code,
      });
    } catch (error) {
      return Result.failure(error as Error);
    }
  }

  async removeLink(code: string): Promise<Result<string, LinkError>> {
    console.log('Attempting to delete link with code:', code);
    try {
      const link = await this.linkRepository.findOne({
        where: { code },
      });

      console.log('Link found for deletion:', link);

      if (!link) throw new NotFoundException('Link not found');

      await this.linkRepository.delete({ code });

      const deletedLink = await this.linkRepository.findOne({
        where: { code },
      });

      console.log('Verifying deletion, link found:', deletedLink);

      if (!deletedLink) return Result.success('Link deleted successfully');

      return Result.failure('Error occurred while deleting link');
    } catch (error) {
      return Result.failure(error as Error);
    }
  }

  async incrementClicks(link: Link): Promise<void> {
    link.clicks += 1;
    await this.linkRepository.save(link);
  }
}
