import { GetServerSideProps, NextPage } from 'next';
import { getWorkById } from '../../api/worksApi';
import { Work, WorkData, ContentBlock } from '../../models/Work';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Image from 'next/image';
import styles from '../../styles/WorkDetail.module.css';
import RelatedProjects from '../../components/works/Related';
import { useState } from 'react';

interface ExtendedWorkData extends WorkData {
    mainVideoUrl: string; 
}

interface Props {
  work: ExtendedWorkData | null;
}

const MediaItemComponent = ({ item, isVideo = false }: { item: any, isVideo?: boolean }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.mediaItem}>
      {!isLoaded && (
        <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
            <span style={{ fontSize: '0.8rem' }}>Loading...</span>
        </div>
      )}

      {isVideo ? (
        <video
          src={item.url}
          controls
          playsInline
          style={{ width: '100%', height: 'auto', display: isLoaded ? 'block' : 'none' }}
          className={isLoaded ? styles.loadedContent : ''}
          onCanPlay={() => setIsLoaded(true)}
        />
      ) : (
        <Image
          src={item.url}
          alt={item.caption || 'Media content'}
          width={800}
          height={100}
          style={{ 
              width: '100%', 
              height: 'auto', 
              opacity: isLoaded ? 1 : 0, 
              transition: 'opacity 0.5s' 
          }}
          unoptimized={item.url.toLowerCase().endsWith('.gif')}
          onLoadingComplete={() => setIsLoaded(true)}
        />
      )}
      
      {isLoaded && item.caption && <p className={styles.caption}>{item.caption}</p>}
    </div>
  );
};

const RenderContentBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'text':
      return <p className={styles.textBlock}>{block.text}</p>;

    case 'image':
    case 'gif':
      const galleryClassName = `${styles.gallery} ${styles[`gallery_${block.layout}`] || ''}`;
      return (
        <div className={galleryClassName}>
          {block.items?.map((item, index) => (
            <MediaItemComponent key={index} item={item} isVideo={false} />
          ))}
        </div>
      );

    case 'video':
       const videoGalleryClass = `${styles.gallery} ${styles[`gallery_${block.layout}`] || ''}`;
       return (
        <div className={videoGalleryClass}>
            {block.items?.map((item, index) => (
                <MediaItemComponent key={index} item={item} isVideo={true} />
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
  
  const [mainVideoLoaded, setMainVideoLoaded] = useState(false);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        
        {mainVideoUrl && (
            <div className={styles.mainVideoContainer}>
                {!mainVideoLoaded && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.spinner}></div>
                        <span>Loading Video...</span>
                    </div>
                )}
                
                <video
                    src={mainVideoUrl}
                    controls
                    playsInline={true}
                    autoPlay={true}
                    muted={true}
                    loop={true}
                    className={`${styles.mainVideoPlayer} ${mainVideoLoaded ? styles.loadedContent : ''}`}
                    style={{ opacity: mainVideoLoaded ? 1 : 0 }}
                    onCanPlay={() => setMainVideoLoaded(true)}
                />
            </div>
        )}

        <div className={styles.header}>
          {work.subtitle && <h2 className={styles.subtitle}>{work.subtitle}</h2>}
          <div className={styles.owner}> {work.owner} </div>
        </div>

        {work.descriptionKo && (
          <p className={styles.description} style={{ whiteSpace: 'pre-wrap' }}>
            {work.descriptionKo} </p>
          )}
        {work.descriptionKo && work.descriptionEn && (
            <div className={styles.divider}></div>
        )}
        {work.descriptionEn && (
          <p className={styles.description} style={{ whiteSpace: 'pre-wrap' }}>
            {work.descriptionEn} </p>
          )}

        <div className={styles.tags}>
          {work.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
          
        <article className={styles.content}>
          {work.data.map((block, index) => {
            const previousBlock = index > 0 ? work.data[index - 1] : null;
            let marginTopValue = '10px'; 
            
            if (index === 0) {
                  marginTopValue = '0px'; 
                } else {
                  // 이전 블록과 그리드 레이아웃이 다르면 20px 띄움
                  if (previousBlock && previousBlock.layout !== block.layout) {
                    marginTopValue = '20px'; 
                  }
                
                  // 현재 블록: 텍스트, 이전 블록: 미디어면 20px 띄움
                  if (block.type === 'text' && previousBlock && previousBlock.type !== 'text') {
                       marginTopValue = '20px'; 
                  }
                
                  // 이전 블록: 텍스트라면 무조건 여백 0
                  if (previousBlock && previousBlock.type === 'text') {
                       marginTopValue = '0px';
                  }
                }

            const blockStyle: React.CSSProperties = {
              marginTop: marginTopValue
            };

            return (
              <div key={index} style={blockStyle}>
                <RenderContentBlock block={block} />
              </div>
            );
          })}
        </article>
      </main>
      <RelatedProjects currentWork={work} /> 
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