import { GetServerSideProps, NextPage } from 'next';
import { getWorkById } from '../../api/worksApi';
import { Work, WorkData, ContentBlock } from '../../models/Work'; // ContentBlock 타입도 import
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Image from 'next/image';
import styles from '../../styles/WorkDetail.module.css'; // 상세 페이지 전용 CSS

interface ExtendedWorkData extends WorkData {
    mainVideoUrl: string; 
}

interface Props {
  work: ExtendedWorkData | null;
}

// 콘텐츠 블록을 렌더링하는 헬퍼 컴포넌트
const RenderContentBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'text':
      return <p className={styles.textBlock}>{block.text}</p>;

    case 'image':
    case 'gif':
      // image, gif 블록 렌더링
      const galleryClassName = `${styles.gallery} ${styles[`gallery_${block.layout}`] || ''}`;
      return (
        <div className={galleryClassName}>
          {block.items?.map((item, index) => (
            <div key={index} className={styles.mediaItem}>
              <Image
                src={item.url}
                alt={item.caption || `Work content ${index + 1}`}
                width={400}
                height={500}
                style={{ width: '100%', height: 'auto' }} // 반응형 스타일
              />
              {item.caption && <p className={styles.caption}>{item.caption}</p>}
            </div>
          ))}
        </div>
      );
    
    default:
      return null;
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
  const mainVideoUrl = (workData as ExtendedWorkData).mainVideoUrl;

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        {mainVideoUrl && (
            <div className={styles.mainVideoContainer}>
                <video
                    src={mainVideoUrl}
                    controls
                    playsInline={true}
                    autoPlay={true}
                    muted={false}
                    loop={false}
                    className={styles.mainVideoPlayer}
                />
            </div>
        )}

        <div className={styles.header}>
          {work.subtitle && <h2 className={styles.subtitle}>{work.subtitle}</h2>}
          <div className={styles.owner}> {work.owner} </div>
          <div className={styles.tags}>
            {work.tags.map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
          </div>
        </div>

        <article className={styles.content}>
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