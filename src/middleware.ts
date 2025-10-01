import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_TOKEN_NAME = 'admin-auth';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(ADMIN_TOKEN_NAME)?.value;
  const loginUrl = new URL('/admin-secu', req.url); // 로그인 페이지 URL

  if (!JWT_SECRET_KEY) {
    console.error('FATAL: JWT_SECRET_KEY가 .env.local 파일에 설정되지 않았습니다.');
    return NextResponse.redirect(loginUrl);
  }

  if (!token) {
    console.log('미들웨어: 토큰이 없어 로그인 페이지로 이동합니다.');
    return NextResponse.redirect(loginUrl);
  }

  // 토큰 검증
  try {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    await jwtVerify(token, secret);
    // 검증 성공
    return NextResponse.next();
  } catch (error) {
    // 검증 실패
    console.log('미들웨어: 토큰 검증 실패, 로그인 페이지로 이동합니다.');
    return NextResponse.redirect(loginUrl);
  }
}

// 미들웨어를 적용할 경로 설정
export const config = {
  matcher: '/admin/:path*', // /admin/ 으로 시작하는 모든 경로
};
