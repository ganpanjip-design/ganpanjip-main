import Link from 'next/link';
import Image from 'next/image';

interface Props {
  onMenuClick?: () => void; // 모바일용 메뉴 토글 버튼 핸들러
}

export default function LeftHeader({ onMenuClick }: Props) {
  return (
    <header className="left-header">
      <button className="mobile-menu-btn" onClick={onMenuClick}>
        <Image 
          src="/images/menu.png"
          alt="Menu"
          width={20}
          height={20} 
          priority
        />
      </button>

      <Link href="/" className="logo-link">
        <div className="logo-box">
          <Image src="/images/logo.png" alt="Logo" fill priority />
        </div>
      </Link>
      <div className="placeholder" />

      <style jsx>{`
        .left-header {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          position: relative;
          width: 100%;
        }
        
        .logo-link {
          display: flex;
          align-items: center;
        }
        .logo-box {
          position: relative; 
          width: 45px;
          height: 45px;
        }
        .mobile-menu-btn {
          position: absolute;
          left: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          display: none;
        }

        .placeholder {
          display: none;
        }

        @media (max-width: 768px) {
          .left-header {
            height: 70px;
            border-bottom: 1px solid #f5f5f5;
          }
          .mobile-menu-btn { 
            display: flex; 
          }
          .logo-box {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </header>
  );
}