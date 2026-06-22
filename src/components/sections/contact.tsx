import styles from '../../styles/Descript.module.css';

const contactInfo = [
  {
    label: 'Mail',
    value: 'ganpanjip@gmail.com↗',
    href: 'mailto:ganpanjip@gmail.com',
  },
  {
    label: 'Tell',
    value: ['+82(0)10-6692-5817', '+82(0)10-7136-7430'],
    href: null,
  },
  {
    label: 'Instagram',
    value: '@ganpanjip_',
    href: 'https://www.instagram.com/ganpanjip_',
  },
  {
    label: 'Address',
    value: ['서울시 동작구 사당로14길 10 지하1층','B1, 10, Sadang-ro 14-gil, Dongjak-gu, Seoul, Republic of Korea'],
    href: null,
  },
];

export default function ContactPage() {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <section className={styles.introSection}>
          <h1 className={styles.title}>Let&apos;s Talk</h1>
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
                {(Array.isArray(item.value) ? item.value : [item.value]).map((val, idx) => {
                  if (item.href) {
                    return (
                      <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer">
                        {val}
                      </a>
                    );
                  } else {
                    return (
                      <p key={idx}>
                        {val}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
