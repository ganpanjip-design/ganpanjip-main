// src/pages/work/[id].tsx

import { GetServerSideProps, NextPage } from 'next';
import { getWorkById } from '../../api/worksApi';
import { Work, WorkData, ContentBlock } from '../../models/Work'; // ContentBlock 타입도 import
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Image from 'next/image';
import styles from '../../styles/WorkDetail.module.css'; // 상세 페이지 전용 CSS

interface Props {
  work: WorkData | null;
}

// 콘텐츠 블록을 렌더링하는 헬퍼 컴포넌트
const RenderContentBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'text':
      return <p className={styles.textBlock}>{block.text}</p>;

    // 'image', 'gif' 등 갤러리 형태는 모두 동일하게 처리
    case 'image':
    case 'gif':
      // block.layout이 'grid-2'이면 styles['gallery_grid-2'] 클래스를 동적으로 적용
      const galleryClassName = `${styles.gallery} ${styles[`gallery_${block.layout}`] || ''}`;

      return (
        <div className={galleryClassName}>
          {block.items?.map((item, index) => (
            <div key={index} className={styles.mediaItem}>
              <Image
                src={item.url}
                alt={item.caption || `Work content ${index + 1}`}
                width={800} // 이 값들은 실제 레이아웃에 맞게 조정 필요
                height={600}
                style={{ width: '100%', height: 'auto' }} // 반응형 스타일
              />
              {item.caption && <p className={styles.caption}>{item.caption}</p>}
            </div>
          ))}
        </div>
      );
    
    // 비디오 타입 등 추후 확장 가능
    // case 'video':
    //   return <video src={...} />;

    default:
      return null; // 알 수 없는 타입은 렌더링하지 않음
  }
};


const WorkDetailPage: NextPage<Props> = ({ work: workData }) => {
  if (!workData) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <p>작품을 찾을 수 없습니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const work = new Work(workData);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{work.title}</h1>
          {work.subtitle && <h2 className={styles.subtitle}>{work.subtitle}</h2>}
          <div className={styles.meta}>
            <span>By. {work.owner}</span>
            <span>{work.formattedDate}</span>
          </div>
          <div className={styles.tags}>
            {work.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
          </div>
        </header>

        <article className={styles.content}>
          {/* 다국어 설명 렌더링 */}
          {work.descriptionKo && <p className={styles.description}>{work.descriptionKo}</p>}
          {work.descriptionEn && <p className={styles.description}>{work.descriptionEn}</p>}
          
          <hr className={styles.divider} />

          {/* work.data 배열을 순회하며 콘텐츠 블록 렌더링 */}
          {work.data.map((block, index) => (
            <RenderContentBlock key={index} block={block} />
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { params } = context;

  if (!params || typeof params.id !== 'string') {
    return { notFound: true };
  }
  const id = params.id;

  try {
    const work = await getWorkById(id);
    if (!work) {
      return { notFound: true };
    }

    return {
      props: {
        work: JSON.parse(JSON.stringify(work)),
      },
    };
  } catch (error) {
    console.error(`Error fetching work ${id}:`, error);
    return { notFound: true };
  }
};

export default WorkDetailPage;