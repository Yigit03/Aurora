import {SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface JwtPayload {
    sub:string,
    email:string,
    role:string,
    fullname: string,  
    iat?:number,
    exp?:number,
}

//acces token oluştur.
export const signAccessToken = async (payload: Omit<JwtPayload, 'iat' | 'exp'>) => {
    return await new SignJWT({...payload})
    .setProtectedHeader({alg: 'HS256'})
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN ?? '1d')
    .sign(JWT_SECRET)
}

//Token doğrula
export const verifyAccesToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      fullname : payload.fullname as string,
      iat: payload.iat,
      exp: payload.exp,
    }
  } catch {
    return null
  }
}

//cookie ayarları
export const tokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60*60*24,
    path:'/',
}

//cookie silme (logout)
export const clearTokenCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/'
}