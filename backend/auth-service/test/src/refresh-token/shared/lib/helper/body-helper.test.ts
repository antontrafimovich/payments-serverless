import { DEFAULT_AUTH_TYPE } from "../../../../../../src/refresh-token/shared/lib/constants";
import { INCORRECT_BODY_FORMAT_ERROR } from "../../../../../../src/refresh-token/shared/lib/errors";
import { getAuthTypeFromEventBody } from "../../../../../../src/refresh-token/shared/lib/helper/body-helper";

describe("Body helper", () => {
  describe("getAuthTypeFromEventBody", () => {
    it("should return default AuthType if body is not provided", () => {
      const body = null;

      expect(getAuthTypeFromEventBody(body)).toBe(DEFAULT_AUTH_TYPE);
    });

    it("should return default AuthType if body was provided without type property", () => {
      const body = "{}";

      expect(getAuthTypeFromEventBody(body)).toBe(DEFAULT_AUTH_TYPE);
    });

    it("should throw error if body is not serializable via JSON.parse", async () => {
      const body = "asdasd";

      try {
        getAuthTypeFromEventBody(body);
      } catch (err) {
        expect(err).toBe(INCORRECT_BODY_FORMAT_ERROR);
      }
    });

    it("should return type from body if one is provided", async () => {
      const TYPE = "google";

      const body = `{"type": \"${TYPE}\"}`;

      expect(getAuthTypeFromEventBody(body)).toBe(TYPE);
    });
  });
});
