import React, { useState, useMemo, useEffect } from 'react';
import WorkCard from './WorkCard';
import { Work, WorkData } from '../../models/Work'; 
import styles from './Related.module.css'; 

interface Props {
  currentWork: Work; 
}

const CARDS_PER_VIEW = 3;
const STORAGE_KEY = 'allWorksData'; 

const RelatedProjects: React.FC<Props> = ({ currentWork }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [allWorks, setAllWorks] = useState<Work[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const dataString = localStorage.getItem(STORAGE_KEY);
      if (!dataString) {
        setAllWorks([]);
        return;
      }
      
      const data: WorkData[] = JSON.parse(dataString);
      const works = data.map(item => new Work(item));
      setAllWorks(works);
      
    } catch (error) {
      console.error("Failed to load or parse works from localStorage:", error);
      setAllWorks([]);
    }
  }, []); 

  const relatedWorks = useMemo(() => {
    if (allWorks.length === 0) return []; 
    const currentTags = new Set(currentWork.tags);

    return allWorks.filter(work => {
      if (work.id === currentWork.id) return false;
      return work.tags.some(tag => currentTags.has(tag));
    });
  }, [currentWork, allWorks]); 

  const maxStartIndex = Math.max(0, relatedWorks.length - CARDS_PER_VIEW);

  const slide = (direction: 'prev' | 'next') => {
    setStartIndex(prevIndex => {
      if (direction === 'prev') {
        return Math.max(0, prevIndex - 1);
      } else {
        return Math.min(maxStartIndex, prevIndex + 1);
      }
    });
  };
  
  // 데이터가 없을 때
  if (relatedWorks.length === 0) {
    if (allWorks.length === 0) return null; 
    return (
      <div className={styles.relatedSection}>
          <div className={styles.header}>
            <div className={styles.title}>Related Projects</div>
          </div>
          <p>관련 작품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.relatedSection}>
      
      <div className={styles.header}>
        <div className={styles.title}>Related Projects</div>
        
        <div className={styles.controls}>
            <button 
            className={`${styles.arrow} ${styles.leftArrow}`}
            onClick={() => slide('prev')}
            disabled={startIndex === 0}
            >
            &lt;
            </button>
            <button 
            className={`${styles.arrow} ${styles.rightArrow}`}
            onClick={() => slide('next')}
            disabled={startIndex >= maxStartIndex}
            >
            &gt;
            </button>
        </div>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.cardTrackWrapper}>
            <div 
            className={styles.cardTrack}
            style={{ transform: `translateX(calc(-${startIndex} * (100% / ${CARDS_PER_VIEW} + 10px)))` }}
            >
            {relatedWorks.map(work => (
                <div key={work.id} className={styles.slideItem}>
                <WorkCard work={work} />
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProjects;