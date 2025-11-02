import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import styles from '../styles/Descript.module.css';

export default function AboutPage() {
  const services = [
    '3D / 2D Motion Graphics', 'Creative Direction & Storyboarding',
    'Video Editing & Compositing', '3D Modeling', 'Branding & Logo Design',
    'Digital Content, Print Design', 'Graphic Design'
  ];

  const members = [
    { name: '박승원 Park Seung Won', role: 'Designer' },
    { name: '유현지 Yu Hyeon Ji', role: 'Designer' }
  ];

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.main}>
        <section className={styles.introSection}>
          <p className={styles.title}>
            Visual Design & Motion Studio 간판집
          </p>
          <p className={styles.description}>
            간판집은 영상, 브랜딩, 그래픽 등 다양한 시각 매체를 넘나들며 새로운 가능성을 탐구하는 디자인 스튜디오입니다. 우리는 클라이언트의 본질을 깊이 이해하는 것에서 출발해, 기획부터 제작까지 전 과정을 함께하며 전략적이고 감각적인 해결책을 제안합니다.
          </p>
          <p className={styles.description}>
            우리에겐 디자인이 곧 브랜드의 ‘간판’입니다. <br />
            간판은 가장 먼저 눈에 띄고, 가장 오래 기억되는 언어이기에, 우리는 클라이언트의 가장 적확한 간판을 함께 만들어갑니다.
          </p>
          <hr className={styles.divider} />
          <p className={styles.descriptionEn}>
            Ganpanjip is a design studio that explores new possibilities across video, branding, and graphic media. <br />
            The name Ganpanjip literally means “Sign House” in Korean—reflecting our belief that design itself is a brand’s signboard. We begin with a deep understanding of our clients and collaborate through every stage—from concept to production—delivering strategic and refined solutions.
          </p>
          <p className={styles.descriptionEn}>
            A signboard is what captures attention first and stays in memory the longest. Ganpanjip creates the most precise and resonant signboard for each client.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Services</h2>
          <div className={styles.tagList}>
            {services.map(service => (
              <span key={service} className={styles.tag}>{service}</span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Member</h2>
          <div className={styles.tagList}>
            {members.map(member => (
              <span key={member.name} className={styles.member}>
                {`${member.name} | ${member.role}`}
              </span>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
