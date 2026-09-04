import { describe, expect, it } from "vitest";
import { InvalidTransitionError, transitionApplication } from "../lib/workflow";

describe("mortgage application workflow", () => {
  it("allows the normal path from draft to active", () => {
    let status = transitionApplication("DRAFT", "SUBMITTED");
    status = transitionApplication(status, "DOCUMENT_REVIEW");
    status = transitionApplication(status, "CREDIT_REVIEW");
    status = transitionApplication(status, "PROPERTY_REVIEW");
    status = transitionApplication(status, "UNDERWRITING");
    status = transitionApplication(status, "APPROVAL");
    status = transitionApplication(status, "CONDITIONS");
    status = transitionApplication(status, "DISBURSEMENT_READY");
    status = transitionApplication(status, "DISBURSED");
    status = transitionApplication(status, "ACTIVE");

    expect(status).toBe("ACTIVE");
  });

  it("rejects skipping controlled workflow stages", () => {
    expect(() => transitionApplication("DRAFT", "APPROVAL")).toThrow(InvalidTransitionError);
  });

  it("allows a credit case to return from approval to underwriting", () => {
    expect(transitionApplication("APPROVAL", "UNDERWRITING")).toBe("UNDERWRITING");
  });
});
