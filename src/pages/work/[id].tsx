import { GetServerSideProps, NextPage } from 'next';
import { getWorkById } from '../../api/worksApi';
import { Work, WorkData, ContentBlock } from '../../models/Work';
import Header from '../../components/common/Header'; 
import Footer from '../../components/common/Footer';
import Image from 'next/image';
import styles from '../../styles/WorkDetail.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ExtendedWorkData extends WorkData {
    mainVideoUrl: string; 
}

interface Props {
  work: ExtendedWorkData | null;
}

interface MediaItem {
  url: string;
  type: 'video' | 'image' | 'gif';
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
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: 'auto', display: isLoaded ? 'block' : 'none' }}
          className={isLoaded ? styles.loadedContent : ''}
          onCanPlay={() => setIsLoaded(true)}
        />
      ) : (
        <Image
          src={item.url}
          alt={'Media content'}
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
    </div>
  );
};

const RenderContentBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'text':
      return <p className={styles.textBlock}>{block.text}</p>;
    case 'image':
    case 'gif':
      return (
        <div className={`${styles.gallery} ${styles[`gallery_${block.layout}`] || ''}`}>
          {block.items?.map((item, index) => (
            <MediaItemComponent key={index} item={item} isVideo={false} />
          ))}
        </div>
      );
    case 'video':
       return (
        <div className={`${styles.gallery} ${styles[`gallery_${block.layout}`] || ''}`}>
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
  const router = useRouter();
  const [mainVideoLoaded, setMainVideoLoaded] = useState(false);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  if (!workData) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <p>작품을 찾을 수 없습니다.</p>
        </main>
      </div>
    );
  }
  
  const work = new Work(workData);
  const mainVideoUrl = (workData as ExtendedWorkData).mainVideoUrl;

  // 모바일 썸네일 가로 슬라이더
  const mediaList: MediaItem[] = [];
  if (mainVideoUrl) mediaList.push({ url: mainVideoUrl, type: 'video' });
  work.data.forEach((block) => {
    if ((block.type === 'image' || block.type === 'gif' || block.type === 'video') && block.items) {
      block.items.forEach((item) => {
        mediaList.push({ url: item.url, type: block.type as 'video' | 'image' | 'gif' });
      });
    }
  });

  useEffect(() => {
    if (mediaList.length > 0) setActiveMedia(mediaList[0]);
  }, [workData]);

  return (
    <div className={styles['page-container']}>
      <Header />
      <div className={styles['main-wrapper']}>
        
        <section className={styles['container-left']}>
          <div className={styles['scroll-area']}>
            <main className={styles.main}>
              {activeMedia && (
                <div className={styles.mobileActiveMedia}>
                  {activeMedia.type === 'video' ? (
                    <video src={activeMedia.url} controls autoPlay muted loop playsInline key={activeMedia.url} />
                  ) : (
                    <img src={activeMedia.url} alt="Active content" />
                  )}
                </div>
              )}
              {/* 모바일 UI */}
              <div className={styles.thumbnailSlider}>
                {mediaList.map((media, idx) => (
                  <div 
                    key={idx} 
                    className={`${styles.thumbnailItem} ${activeMedia?.url === media.url ? styles.activeThumb : ''}`}
                    onClick={() => setActiveMedia(media)}
                  >
                    {media.type === 'video' ? (
                      <video src={media.url} muted playsInline />
                    ) : (
                      <img src={media.url} alt="thumbnail" />
                    )}
                  </div>
                ))}
              </div>
              {/* 데스크톱 UI */}
              <div className={styles.desktopContentArticle}>
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
                          playsInline
                          autoPlay
                          muted
                          preload="auto"
                          loop
                          className={`${styles.mainVideoPlayer} ${mainVideoLoaded ? styles.loadedContent : ''}`}
                          style={{ opacity: mainVideoLoaded ? 1 : 0 }}
                          onCanPlay={() => setMainVideoLoaded(true)}
                        />
                    </div>
                )}
                <article className={styles.content}>
                  {work.data.map((block, index) => {
                    const previousBlock = index > 0 ? work.data[index - 1] : null;
                    let marginTopValue = '0px'; 
                    if (index > 0) {
                      if (previousBlock && previousBlock.layout !== block.layout) marginTopValue = '20px';
                      if (block.type === 'text' && previousBlock && previousBlock.type !== 'text') marginTopValue = '20px';
                    }
                    return (
                      <div key={index} style={{ marginTop: marginTopValue }}>
                        <RenderContentBlock block={block} />
                      </div>
                    );
                  })}
                </article>
              </div>

            </main>
          </div>
        </section>

        {/* 3. 우측 고정/개별스크롤 정보 영역 */}
        <section className={styles['container-right']}>
          <div className={styles['scroll-area']}>
            
            <div className={styles.backButtonContainer}>
              <button className={styles.backButton} onClick={() => router.back()}>
                <Image src="/images/backBTN.png" alt="Back" width={100}  height={100} />
              </button>
            </div>
            <div className={styles.titleContainer}>
            <div className={styles.header}>
              {work.subtitle && <h2 className={styles.subtitle}>{work.subtitle}</h2>}
              <div className={styles.info}> {work.owner} | {work.date.slice(0, 4)} </div>
            </div>

            {work.descriptionKo && (
              <p className={styles.descriptionKo} style={{ whiteSpace: 'pre-wrap' }}>{work.descriptionKo}</p>
            )}
            {work.descriptionEn && (
              <p className={styles.descriptionEn} style={{ whiteSpace: 'pre-wrap' }}>{work.descriptionEn}</p>
            )}

            <div className={styles.tags}>
              {work.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
    
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { params } = context;
  if (!params || typeof params.id !== 'string') return { notFound: true };
  try {
    const work = await getWorkById(params.id);
    if (!work) return { notFound: true };
    return { props: { work: JSON.parse(JSON.stringify(work)) } };
  } catch (error) {
    return { notFound: true };
  }
};

export default WorkDetailPage;