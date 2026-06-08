import { useRouter } from 'next/router';

export default function WorkHeader() {
    const router = useRouter();
  return (
    <header className="left-header">
      <button className="back-btn" onClick={() => router.back()}>
        &lt; Back
      </button>
      <style jsx>{`
      .back-btn {
          background: none;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 20px;
          font-weight: 500;
          color: #333;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        .back-btn:hover {
          background-color: #f5f5f5;
        }
        `}</style>
    </header>
  );
}   