import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

const LOGIN_PAGE = '/admin'
const DASHBOARD = '/admin/dashboard'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
    console.log('MIDDLEWARE ÇALIŞTI:', pathname)
  const token = req.cookies.get('admin_token')?.value
    console.log('TOKEN VAR MI:', !!token)

  const verifyToken = async () => {
    if (!token) return null
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      return payload
    } catch {
      return null
    }
  }

  const payload = await verifyToken()
  const isLoginPage = pathname === LOGIN_PAGE

  // Giriş yapmış kullanıcı login sayfasına gelirse dashboard'a gönder
  if (isLoginPage && payload) {
    return NextResponse.redirect(new URL(DASHBOARD, req.url))
  }

  // Giriş yapmamış kullanıcı login dışında bir yere giderse login'e gönder
  if (!isLoginPage && !payload) {
    const loginUrl = new URL(LOGIN_PAGE, req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (payload) {
    const response = NextResponse.next()
    response.headers.set('x-user-id', payload.sub as string)
    response.headers.set('x-user-role', payload.role as string)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/(admin)(.*)',],
}