import { GetServerSideProps, NextPage } from 'next';
import { getWorks } from '../api/worksApi';
import { Work, WorkData } from '../models/Work';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import WorkCard from '../components/works/WorkCard';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router'; 
import { PREDEFINED_TAGS } from '../constants/tags'; 
import Link from 'next/link';
import React, { useEffect } from 'react'; 

interface Props {
  works: WorkData[];
}
const STORAGE_KEY = 'allWorksData'; 

const HomePage: NextPage<Props> = ({ works: worksData }) => {
  const router = useRouter(); 
  const { type, tag } = router.query;
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(worksData));
        } catch (error) {
          console.error("Failed to save works data to localStorage:", error);
        }
    }
  }, [worksData]); 
  
  const selectedTags = Array.isArray(tag) ? tag : (tag ? [tag] : []);
  
  // WorkData를 Work 클래스 인스턴스로 변환
  const allWorks = worksData
    .map(data => new Work(data))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 표시할 작품 필터링
  const filteredWorks = allWorks.filter(work => {
    // workType 필터링
    const typeMatch = (type !== 'work' && type !== 'original') || work.workType === type;

    // Tag 필터링
    let tagMatch = true;
    if (selectedTags.length > 0) {
        tagMatch = selectedTags.every(selectedTag => 
            work.tags.includes(selectedTag)
        );
    }
    
    return typeMatch && tagMatch;
  });

  // 태그 토글 함수 
  const toggleTag = (targetTag: string) => {
    const newTags = [...selectedTags];
    const currentTagIndex = newTags.indexOf(targetTag);

    if (currentTagIndex > -1) {
      newTags.splice(currentTagIndex, 1);
    } else {
      newTags.push(targetTag);
    }
    
    const newQuery = { ...router.query };
    delete newQuery.tag;

    if (newTags.length > 0) {
        newQuery.tag = newTags;
    }
    
    router.push({
      pathname: router.pathname,
      query: newQuery,
    }, undefined, { shallow: true });
  };

  // 태그 초기화 함수 
  const clearTags = () => {
    const newQuery = { ...router.query };
    delete newQuery.tag;
    
    router.push({
      pathname: router.pathname,
      query: newQuery,
    }, undefined, { shallow: true });
  };
  
  return (
    <div>
      <Header />
      <main className={styles.main}>
      <nav className={styles.tagNav}>
        <button 
          onClick={clearTags} 
          className={`${styles.tagItem} ${selectedTags.length === 0 ? styles.tagActive : ''}`}
        >
          All
        </button>
        {PREDEFINED_TAGS.map(tag => {
          const isActive = selectedTags.includes(tag);
          return (
            <button 
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`${styles.tagItem} ${isActive ? styles.tagActive : ''}`}
            >
              {tag}
            </button>
          );
        })}
      </nav>
        <div className={styles.grid}>
          {filteredWorks.length > 0 ? (
            filteredWorks.map(work => <WorkCard key={work.id} work={work} />)
          ) : (
            <p>표시할 작품이 없습니다.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const works = await getWorks(); 
    const worksData = JSON.parse(JSON.stringify(works)); 

    return {
      props: {
        works: worksData, // 모든 작품 데이터
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        works: [],
      },
    };
  }
};

export default HomePage;