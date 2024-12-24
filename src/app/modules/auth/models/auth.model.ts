export class AuthModel {
  accessToken: string;

  setAuth(auth: AuthModel) {
    this.accessToken = auth.accessToken;
  }
}
