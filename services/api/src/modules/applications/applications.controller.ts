import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { z } from "zod";

const CreateApplicationSchema = z.object({
  customerId: z.string().uuid(),
  productId: z.string().uuid(),
  requestedAmount: z.number().positive(),
  tenureMonths: z.number().int().positive(),
});

type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;

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
      status: "DRAFT",
    };
  }

  @Post()
  createApplication(@Body() body: unknown) {
    const input: CreateApplicationInput = CreateApplicationSchema.parse(body);

    return {
      message: "Application command accepted by API boundary.",
      data: {
        applicationId: crypto.randomUUID(),
        status: "DRAFT",
        ...input,
      },
    };
  }
}
