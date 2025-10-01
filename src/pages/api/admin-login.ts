import { NextApiRequest, NextApiResponse } from 'next';
import { SignJWT } from 'jose';
import { serialize } from 'cookie';

const ADMIN_TOKEN_NAME = 'admin-auth';
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // 환경 변수가 설정되지 않았을 경우의 방어 코드
  if (!process.env.ADMIN_PWD || !JWT_SECRET_KEY) {
    console.error('ADMIN_PWD 또는 JWT_SECRET_KEY가 .env.local 파일에 설정되지 않았습니다.');
    return res.status(500).json({ message: '서버 설정 오류입니다.' });
  }

  const { password } = req.body;

  // 비밀번호 검증
  if (password === process.env.ADMIN_PWD) {
    // 비밀번호 일치 시 JWT 생성
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    const token = await new SignJWT({ isAdmin: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // 1시간 후 만료
      .sign(secret);

    // 쿠키 생성
    const cookie = serialize(ADMIN_TOKEN_NAME, token, {
      httpOnly: true, // JavaScript에서 접근 불가
      secure: process.env.NODE_ENV === 'production',
      path: '/', // 웹사이트 전체 경로에서 유효
      maxAge: 60 * 60, // 1시간 (초 단위)
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ message: '로그인 성공' });
  } else {
    // 비밀번호 불일치
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  }
}
