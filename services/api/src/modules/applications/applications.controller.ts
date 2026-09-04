import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import type { MortgageApplicationStatus } from "@mortgageops/domain";
import { CreateMortgageApplicationSchema, type CreateMortgageApplicationInput } from "@mortgageops/schemas";

@Controller("applications")
export class ApplicationsController {
  @Get()
  listApplications() {
    return {
      data: [],
      meta: { total: 0 },
    };
  }

  @Get(":id")
  getApplication(@Param("id") id: string) {
    return {
      id,
      status: "DRAFT" satisfies MortgageApplicationStatus,
    };
  }

  @Post()
  createApplication(@Body() body: unknown) {
    const input: CreateMortgageApplicationInput = CreateMortgageApplicationSchema.parse(body);

    return {
      message: "Application command accepted by API boundary.",
      data: {
        applicationId: crypto.randomUUID(),
        status: "DRAFT" satisfies MortgageApplicationStatus,
        ...input,
      },
    };
  }
}
