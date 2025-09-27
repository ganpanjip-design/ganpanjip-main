// src/components/works/WorkCard.tsx

import React from 'react';
import Link from 'next/link';
import { Work } from '../../models/Work';
import styles from './WorkCard.module.css'; // WorkCard 전용 CSS 모듈

interface Props {
  work: Work;
}

const WorkCard: React.FC<Props> = ({ work }) => {
  return (
    <Link href={`/work/${work.id}`} className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img src={work.thumbnail} alt={`${work.title} thumbnail`} className={styles.thumbnail} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{work.title}</h3>
        <div className={styles.meta}>
          <span className={styles.owner}>{work.owner}</span>
        </div>
        <div className={styles.tags}>
          {work.tags.slice(0, 3).map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default WorkCard;