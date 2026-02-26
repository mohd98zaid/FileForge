import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
    const publicKey = process.env.NEXT_PUBLIC_ILOVEPDF_PUBLIC_KEY;
    const secretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!publicKey || !secretKey) {
        return NextResponse.json({ error: 'Missing API keys' }, { status: 500 });
    }

    try {
        // Manually generate JWT token for client-side use
        // The SDK does not expose a client-token generation method easily
        const header = { typ: 'JWT', alg: 'HS256' };
        // Token valid for 1 hour
        // Token based on @ilovepdf/ilovepdf-js-core implementation
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: 'api.ilovepdf.com', // Issuer must be the API domain
            jti: publicKey, // JTI must be the Public Key!
            iat: now - 5, // Backdate slightly to avoid clock skew
            nbf: now - 5,
            exp: now + 3600
        };

        const base64UrlEncode = (obj: any) => {
            return Buffer.from(JSON.stringify(obj))
                .toString('base64')
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        };

        const encodedHeader = base64UrlEncode(header);
        const encodedPayload = base64UrlEncode(payload);

        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const token = `${encodedHeader}.${encodedPayload}.${signature}`;

        return NextResponse.json({ token });
    } catch (error) {
        console.error('iLovePDF Auth Error:', error);
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}
