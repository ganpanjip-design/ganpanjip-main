import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import styles from '../styles/Descript.module.css';

// 이메일 링크 옆에 표시될 화살표 아이콘 컴포넌트
const ArrowIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }}
  >
    <path d="M7 17l9.2-9.2M17 17V7H7" />
  </svg>
);

// 연락처 정보를 배열로 관리하여 코드 가독성 향상
const contactInfo = [
  {
    label: 'Mail',
    value: 'ganpanjip@gmail.com',
    href: 'mailto:ganpanjip@gmail.com',
  },
  {
    label: 'Tell',
    value: '+82(0)10-6692-5817  OR  +82(0)10-7136-7430',
    href: null,
  },
  {
    label: 'Instagram',
    value: '@ganpanjip_',
    href: 'https://www.instagram.com/ganpanjip_', // 인스타그램 링크 추가
  },
  {
    label: 'Address',
    value: '서울시 동작구 사당로14길 10 지하1층\nB1, 10, Sadang-ro 14-gil, Dongjak-gu, Seoul,\nRepublic of Korea',
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <section className={styles.introSection}>
          <h1 className={styles.title}>Let's Talk</h1>
          <p className={styles.description}>
            간판집은 새로운 협업과 프로젝트 제안을 언제나 환영합니다.
            <br />
            아래 연락처로 문의 주시면 확인 후 빠르게 회신드리겠습니다.
          </p>

          <hr className={styles.divider} />

          <p className={styles.descriptionEn}>
            ganpanjip is always open to new collaborations and project proposals.
            <br />
            Please reach out through the contacts below—we’ll get back to you as soon as possible.
          </p>
        </section>

        <section>
          {contactInfo.map((item) => (
            <div key={item.label} className={styles.contactItem}>
              <h2 className={styles.contactLabel}>{item.label}</h2>
              <div className={styles.contactValue}>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.value}
                    {item.label === 'Mail' && <ArrowIcon />}
                  </a>
                ) : (
                  <p>{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
