export abstract class AuthService {
  public isThirdParty: boolean;
}

export abstract class ThirdPartyAuthService extends AuthService {
  public isThirdParty = true;

  public abstract generateUrl(redirectTo: string): Promise<string>;
}

export abstract class LocalAuthService extends AuthService {
  public isThirdParty = false;

  public abstract authenticate(
    login: string,
    password: string
  ): Promise<string>;
}
