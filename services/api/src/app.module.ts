import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health.controller.js";
import { ApplicationsController } from "./modules/applications/applications.controller.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [HealthController, ApplicationsController],
})
export class AppModule {}
