import { Controller, Post, Body } from '@nestjs/common';
import { ROUTES } from 'src/routes.constants';
import { AuthService } from './auth.service';
import { Public } from './jwt-auth.guard';
import { EmittedToken, AuthPayload } from './types';

@Controller(ROUTES.API.AUTH.BASE)
export class AppController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post(ROUTES.API.AUTH.LOGIN)
  async login(@Body() body: AuthPayload): Promise<EmittedToken> {
    const { username, password } = body;

    return this.authService.auth(username, password);
  }

  @Public()
  @Post(ROUTES.API.AUTH.REGISTER)
  register(@Body() body: AuthPayload): Promise<EmittedToken> {
    const { username, password } = body;

    return this.authService.register(username, password);
  }
}
