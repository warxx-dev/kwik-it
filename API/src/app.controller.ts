import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { LinkService } from './modules/link/link.service';

@Controller()
export class AppController {
  constructor(private readonly linkService: LinkService) {}

  @Get('r/:code')
  @Redirect()
  async redirectTooriginalUrl(@Param('code') code: string) {
    const link = await this.linkService.getLinkByCode(code);

    if (link) {
      await this.linkService.incrementClicks(link);
      return { url: link.originalUrl, statusCode: 302 };
    }
    return Promise.resolve({
      url: `${process.env.CLIENT_URL}?error=link-not-found`,
      statusCode: 302,
    });
  }
}
