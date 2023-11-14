import { AuthService } from "../../shared";
import { GoogleAuthService } from "../../shared/service/google.service";
import { AuthType } from "../shared/model/auth-type";

export const getAuthService = (type: AuthType): AuthService => {
  if (type === "google") {
    return new GoogleAuthService();
  }

  return {} as AuthService;
};
