import { getAuthService } from "../../../../src/refresh-token/service/auth-service.factory";
import { GoogleAuthService } from "../../../../src/shared";

describe("AuthServiceFactory", () => {
  describe("getAuthService", () => {
    it("should return instance of GoogleAuthService if provided type is google", () => {
      expect(getAuthService("google")).toBeInstanceOf(GoogleAuthService);
    });

    it("should return empty object if provided type differs from google", () => {
      expect(getAuthService("local")).toStrictEqual({});
    });
  });
});
