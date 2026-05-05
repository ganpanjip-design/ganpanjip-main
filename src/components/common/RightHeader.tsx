interface Props {
  view: 'about' | 'contact';
  setView: (view: 'about' | 'contact') => void;
}

export default function RightHeader({ view, setView }: Props) {
  return (
    <header className="right-header">
      <nav>
        <button 
          onClick={() => setView('about')}
          style={{ 
            fontWeight: view === 'about' ? 'bold' : 'normal',
            color: view === 'about' ? 'black' : '#c5c5c5' // 선택 시 검정, 미선택 시 회색
          }}
        >About</button>
        <button 
          onClick={() => setView('contact')}
          style={{ 
            fontWeight: view === 'contact' ? 'bold' : 'normal',
            color: view === 'contact' ? 'black' : '#c5c5c5' // 선택 시 검정, 미선택 시 회색
          }}
        >Contact</button>
      </nav>

      <style jsx>{`
        .right-header {
          display: flex;
          justify-content: right;
          align-items: end;
          height: 60px;
          padding-right: 2rem;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
        }
        nav { display: flex; gap: 1rem; align-items: center; }
        button { border: none; background: none; cursor: pointer; font-size: 1.1rem; }
      `}</style>
    </header>
  );
}