import { verifyAuthToken, signAuthToken } from './auth';

describe('verifyAuthToken', () => {
  it('should return null for invalid token formats', async () => {
    expect(await verifyAuthToken('invalidtoken')).toBeNull();
    expect(await verifyAuthToken('.')).toBeNull();
    expect(await verifyAuthToken('payload.')).toBeNull();
    expect(await verifyAuthToken('.sig')).toBeNull();
  });

  it('should return null for invalid base64 encoding', async () => {
    expect(await verifyAuthToken('invalid_base64_%%%!@#$.sig')).toBeNull();
  });

  it('should return null for invalid signature', async () => {
    const validToken = await signAuthToken({ userId: '123' });
    const [payload] = validToken.split('.');
    expect(await verifyAuthToken(`${payload}.invalid_signature_base64`)).toBeNull();
  });

  it('should return valid payload for valid token', async () => {
    const validToken = await signAuthToken({ userId: '123', username: 'test' });
    const result = await verifyAuthToken(validToken);
    expect(result).toMatchObject({ userId: '123', username: 'test' });
  });
});
