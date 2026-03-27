import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LinkModule } from './modules/link/link.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { RedirectMiddleware } from './middleware/redirect.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // 1. Inyectamos el driver de LibSQL
      driver: require('@libsql/sqlite3'),
      database: `${process.env.TURSO_DATABASE_URL}?authToken=${process.env.TURSO_AUTH_TOKEN}`,
      // 2. IMPORTANTE: Esta es la clave. Engañamos a TypeORM diciéndole
      // que el "package" que debe buscar es el de libsql, no sqlite3.
      extra: {
        authToken: process.env.TURSO_AUTH_TOKEN,
      },
      // Forzamos a que no busque el paquete 'sqlite3'
      // @ts-ignore
      driverPackage: require('@libsql/sqlite3'),

      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    LinkModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RedirectMiddleware).forRoutes('*');
  }
}
