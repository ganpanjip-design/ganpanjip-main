import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CSSProperties } from 'react';

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;
  const currentType = router.query.type;

  const activeLinkStyle: CSSProperties = {
    fontWeight: 'bold',
  };

  const inactiveLinkStyle: CSSProperties = {
    color: '#9f9f9f',
  };

  return (
    <>
      <header>
        <nav>
          {/* 1. 로고 이미지: 클릭하면 메인 페이지로 이동 */}
          <Link href="/" className="logo-link">
            <Image 
              src="/images/logo.png" // public 폴더 기준 경로
              alt="My Portfolio Logo" 
              width={40} // 실제 로고 이미지의 너비
              height={40} // 실제 로고 이미지의 높이
              priority // 페이지에서 중요한 이미지임을 표시 (선택사항)
            />
          </Link>

          {/* 2. 내비게이션 메뉴 */}
          <ul className="nav-menu">
            <li>
              <Link 
                href="/?type=work" 
                style={currentPath === '/' && currentType === 'work' ? activeLinkStyle : inactiveLinkStyle}
              >
                Work
              </Link>
            </li>
            <li>
              <Link 
                href="/?type=original" 
                style={currentPath === '/' && currentType === 'original' ? activeLinkStyle : inactiveLinkStyle}
              >
                Original
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                style={currentPath === '/about' ? activeLinkStyle : inactiveLinkStyle}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                style={currentPath === '/contact' ? activeLinkStyle : inactiveLinkStyle}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* 3. 스타일: Flexbox를 사용한 레이아웃 */}
        <style jsx>{`
          header {
            width: 100%;
            padding: 1rem 2rem;
            border-bottom: 1px solid #eaeaea;
            background-color: white;
            
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10; /* 다른 콘텐츠 위에 표시 */
          }
          nav {
            display: flex;
            justify-content: space-between; 
            align-items: center; 
            max-width: 1200px;
            margin: 0 auto;
          }
          .logo-link {
            display: flex; 
            align-items: center;
          }
          .nav-menu {
            display: flex;
            gap: 2rem; 
            list-style: none; 
            margin: 0;
            padding: 0;
          }
          .nav-menu a {
            text-decoration: none;
            color: #333; 
            font-size: 1rem;
            transition: color 0.2s;
          }
          .nav-menu a:hover {
            color: #333;
          }
        `}</style>
      </header>
      <div style={{ height: '62px' }}></div> 
    </>
  );
}