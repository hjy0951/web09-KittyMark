import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { ResponseInterceptor } from './interceptor/responseInterceptor';
import { S3Module } from './S3/S3.module';
import { AuthGuard } from './auth/auth.guard';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './user/follow/follow.module';
import { MapModule } from './map/map.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    HttpModule,
    AuthModule,
    BoardModule,
    CommentModule,
    S3Module,
    FollowModule,
    MapModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ResponseInterceptor, AuthGuard],
})
export class AppModule {}
