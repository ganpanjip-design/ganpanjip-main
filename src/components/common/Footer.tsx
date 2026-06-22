import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-brand">STUDIO GANPANJIP</div>
      <div className="footer-info">
        <span className="desktop-only">based in Seoul, South Korea</span>
        <span className="divider desktop-only">|</span>
        <span>focused on Visual Design & Motion graphics</span>
        <span className="divider">|</span>
        <Link href="mailto:ganpanjip@gmail.com">
          ganpanjip@gmail.com↗
        </Link>
      </div>

      <style jsx>{`
        .footer-container {
          width: 100%;
          text-align: center;
          height: 60px;
          font-family: 'Pretendard', -apple-system, sans-serif;
          border-top: 1px solid #000000;
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .footer-brand {
          font-size: 0.75rem;
          color: #000000;
        }

        .footer-info {
          font-size: 0.65rem;
          color: #959595;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
        }

        .divider {
          color: #ccc;
          margin: 0 4px;
        }

        @media (max-width: 768px) {
          .footer-container {
            position: absolute;
            bottom: 0;
            background: #fff;
            padding: 10px;
          }
          
          .desktop-only {
            display: none;
          }
          
          .footer-info {
            gap: 1px;
          }
        }
      `}</style>
    </footer>
  );
}