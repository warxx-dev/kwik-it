import { User } from 'src/generated/prisma/client';

export type AuthSuccessData = {
  access_token: string;
  user: User;
};
