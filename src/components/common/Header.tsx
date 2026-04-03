import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CSSProperties } from 'react';

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;

  const activeLinkStyle: CSSProperties = {
    fontWeight: 'bold',
    color: '#333',
  };

  const inactiveLinkStyle: CSSProperties = {
    color: '#9f9f9f',
  };

  return (
    <>
      <header>
        <nav>
          {/* 로고 */}
          <Link href="/" className="logo-link">
            <Image 
              src="/images/logo.png"
              alt="My Portfolio Logo" 
              width={40} 
              height={40} 
              priority
            />
          </Link>

          {/* 네비게이션 */}
          <ul className="nav-menu">
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

        <style jsx>{`
          header {
            width: 100%;
            padding: 1rem 2rem;
            border-bottom: 1px solid #eaeaea;
            background-color: white;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 10;
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