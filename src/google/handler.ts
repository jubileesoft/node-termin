import fetch from 'node-fetch';
import GoogleAppConfig from './app-config';
import { GoogleUser } from './object';

export default class {
  public static async verifyAccessToken(
    token: string
  ): Promise<GoogleUser | undefined> {
    const url =
      'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token;

    const res = await fetch(url, {
      method: 'GET',
      compress: false,
    });

    const buffer = res.body.read();
    const text = buffer.toString('utf8');
    const user: GoogleUser = JSON.parse(text);
    if (
      typeof user.aud === 'undefined' ||
      user.aud !== GoogleAppConfig.clientId
    ) {
      return undefined;
    }

    return user;
  }
}
