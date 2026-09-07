import {  Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { UsersModule } from "../Users/users.module.js";
import { EmailConfirmationModule } from "./email-confirmation/email-confirmation.module.js";

@Module({
  imports: [UsersModule,EmailConfirmationModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
