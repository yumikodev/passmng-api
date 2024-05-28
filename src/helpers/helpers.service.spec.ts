import { Test, TestingModule } from "@nestjs/testing";
import { HelpersService } from "./helpers.service";

describe("HelpersService", () => {
  let service: HelpersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HelpersService],
    }).compile();

    service = module.get<HelpersService>(HelpersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  const testPass = "testpass1234",
    testSecret = "testSecret1234";

  let securePass: string;

  it("should encrypt a password", async () => {
    securePass = await service.encrypt(testPass, testSecret);

    expect(typeof securePass).toBe("string");
  });

  it("should decrypt a secure password", async () => {
    const decryptPass = await service.decrypt(securePass, testSecret);

    expect(decryptPass).toBe(testPass);
  });
});
