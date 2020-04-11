import fetch from 'node-fetch';
import GoogleAppConfig from './app-config';

export default class {
  public static async verifyAccessToken(
    token: string
  ): Promise<object | undefined> {
    const url =
      'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token;

    const res = await fetch(url, {
      method: 'GET',
      compress: false,
    });

    const buffer = res.body.read();
    const text = buffer.toString('utf8');
    const user = JSON.parse(text);
    if (
      typeof user.aud === 'undefined' ||
      user.aud !== GoogleAppConfig.clientId
    ) {
      return undefined;
    }

    // Inject access_token in user object
    user.access_token = token;

    return user;
  }
}
