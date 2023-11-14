export abstract class AuthService {
  public isThirdParty: boolean;

  public abstract refreshToken(token: string): Promise<Record<string, any>>;
}

export abstract class ThirdPartyAuthService extends AuthService {
  public isThirdParty = true;

  public abstract generateUrl(redirectTo: string): Promise<string>;

  public abstract getToken(
    code: string,
    redirectTo: string
  ): Promise<Record<string, any>>;
}

export abstract class LocalAuthService extends AuthService {
  public isThirdParty = false;

  public abstract authenticate(
    login: string,
    password: string
  ): Promise<string>;
}
