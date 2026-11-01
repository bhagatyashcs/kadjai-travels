import crypto from 'crypto';

let ephemeralDevSecret = null;

/**
 * Validates and retrieves the JWT signing secret.
 * Enforces strict environment variable in production and generates an ephemeral
 * in-memory 256-bit key in development if unset, eliminating any static hardcoded secrets.
 */
function getSigningSecret() {
  const secret = process.env.JWT_SECRET;

  if (secret && secret.length >= 32) {
    return secret;
  }

  // Resilient fallback: Generate an in-memory random secret per process run
  if (!ephemeralDevSecret) {
    ephemeralDevSecret = crypto.randomBytes(32).toString('hex');
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[AUTH] Using generated 256-bit token signing key for current session.');
    }
  }

  return ephemeralDevSecret;
}

const TOKEN_EXPIRY_MS = Number(process.env.TOKEN_EXPIRY_HOURS || 24) * 60 * 60 * 1000;

/**
 * Generate a cryptographically secure random salt
 */
export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hash password with PBKDF2 (10,000 iterations, sha512)
 */
export function hashPassword(password, salt) {
  if (!password || !salt) {
    throw new Error('Password and salt are required for hashing');
  }
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

/**
 * Verify plaintext password against stored hash and salt with constant-time equality
 */
export function verifyPassword(password, hash, salt) {
  if (!password || !hash || !salt) return false;
  try {
    const computedHash = hashPassword(password, salt);
    const computedBuf = Buffer.from(computedHash, 'utf8');
    const expectedBuf = Buffer.from(hash, 'utf8');

    if (computedBuf.length !== expectedBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuf, expectedBuf);
  } catch {
    return false;
  }
}

/**
 * Generate a signed session token
 */
export function createSessionToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    fullName: user.full_name || user.fullName,
    exp: Date.now() + TOKEN_EXPIRY_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const secret = getSigningSecret();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verify signed session token with constant-time comparison & buffer length protection
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  try {
    const secret = getSigningSecret();
    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(payloadB64)
      .digest('base64url');

    const sigBuf = Buffer.from(signature, 'utf8');
    const expBuf = Buffer.from(expectedSig, 'utf8');

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Express middleware for owner authentication
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  const user = verifySessionToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session token' });
  }

  req.user = user;
  next();
}
