import {
  NO_REDIRECT_URI_ERROR,
  NO_TOKEN_ERROR,
  createRefreshTokenError,
} from "../../../src/refresh-token/lib/error";
import { handler } from "./../../../src/refresh-token";

const refreshAccessTokenMock = jest.fn();

jest.mock("./../../../src/shared/lib/service/google-client.service.ts", () => {
  return {
    createGoogleClient: jest.fn(function () {
      return {
        setCredentials: jest.fn(function () {
          console.log("Credentials have been set");
        }),

        refreshAccessToken: refreshAccessTokenMock,
      };
    }),
  };
});

describe("Refresh Token functionality", () => {
  // it("should throw error if redirectUri is not provided", async () => {
  //   expect.assertions(1);

  //   const INPUT_PARAMS = { body: { token: "fake" } } as any;

  //   await expect(handler(INPUT_PARAMS)).rejects.toThrowError(
  //     NO_REDIRECT_URI_ERROR
  //   );
  // });

  it("should throw error if token is not provided", async () => {
    expect.assertions(1);

    const INPUT_PARAMS = { body: { redirectUri: "fake" } } as any;

    await expect(handler(INPUT_PARAMS)).rejects.toThrowError(NO_TOKEN_ERROR);
  });

  it("should throw error if client's refreshAccessToken didn't go well", async () => {
    expect.assertions(1);
    const INPUT_PARAMS = {
      body: {
        redirectUri: "redirect",
        token: encodeURIComponent(btoa('{"value": "token"}')),
      },
    } as any;

    refreshAccessTokenMock.mockImplementation(function () {
      return { credentials: "TEST_TOKEN" };
    });

    await expect(handler(INPUT_PARAMS)).resolves.toBe(
      btoa(JSON.stringify("TEST_TOKEN"))
    );
  });

  it("should return new token", async () => {
    expect.assertions(1);
    const INPUT_PARAMS = {
      body: {
        redirectUri: "redirect",
        token: encodeURIComponent(btoa('{"value": "token"}')),
      },
    } as any;
    const ERROR_DETAILS = "Some details";

    refreshAccessTokenMock.mockImplementation(function () {
      throw new Error(ERROR_DETAILS);
    });

    await expect(handler(INPUT_PARAMS)).rejects.toThrowError(
      createRefreshTokenError(ERROR_DETAILS)
    );
  });
});
