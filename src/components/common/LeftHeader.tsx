import Link from 'next/link';
import Image from 'next/image';

interface Props {
  onMenuClick?: () => void; // 모바일용 메뉴 토글 버튼
}

export default function LeftHeader({ onMenuClick }: Props) {
  return (
    <header className="left-header">
      <div className="placeholder" />
      <Link href="/" className="logo-link">
        <Image src="/images/logo.png" alt="Logo" width={45} height={45} priority />
      </Link>
      <button className="mobile-menu-btn" onClick={onMenuClick}>=</button>

      <style jsx>{`
        .left-header {
          display: flex;
          justify-content: center;
          align-items: end;
          height: 100px;
        }
        .logo-link { position: absolute; left: 50%; transform: translateX(-50%); }
       
        .mobile-menu-btn {
        position: absolute;
        left: 1rem;
        display: none;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </header>
  );
}