import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { LinkService } from './modules/link/link.service';

@Controller()
export class AppController {
  constructor(private readonly linkService: LinkService) {}

  @Get('r/:code')
  @Redirect()
  async redirectToOriginalLink(@Param('code') code: string) {
    const result = await this.linkService.getLinkByCode(code);
    return result.fold(
      async (link) => {
        await this.linkService.incrementClicks(link);
        return { url: link.originalLink, statusCode: 302 };
      },
      () => {
        return Promise.resolve({
          url: `${process.env.CLIENT_URL}?error=link-not-found`,
          statusCode: 302,
        });
      },
    );
  }
}
