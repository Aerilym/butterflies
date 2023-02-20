import * as jose from 'jose';

export interface JwtUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  appId: string;
  kid: string;
}

/**
 * Function generates a JaaS JWT.
 */
export async function generateJWT(privateKey: string, user: JwtUser): Promise<string> {
  const now = new Date();

  const payload: jose.JWTPayload = {
    aud: 'jitsi',
    context: {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        moderator: 'true',
      },
      features: {
        livestreaming: 'true',
        recording: 'true',
        transcription: 'true',
        'outbound-call': 'true',
      },
    },
    iss: 'chat',
    room: '*',
    sub: user.appId,
    exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
    nbf: Math.round(new Date().getTime() / 1000) - 10,
  };

  const encodedPrivateKey = await jose.importPKCS8(privateKey, 'RS256');

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({
      alg: 'RS256',
      kid: user.kid,
      typ: 'JWT',
    })
    .sign(encodedPrivateKey);

  return jwt;
}
