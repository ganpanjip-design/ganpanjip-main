import { GetServerSideProps, NextPage } from 'next';
import { getWorks } from '../api/worksApi';
import { Work, WorkData } from '../models/Work';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import WorkCard from '../components/works/WorkCard';
import { useRouter } from 'next/router'; 
import { PREDEFINED_TAGS } from '../constants/tags'; 
import React, { useEffect } from 'react'; 
import { useState } from 'react';
import styles from '../styles/Home.module.css';
import Head from 'next/head'

interface Props {
  works: WorkData[];
}
const STORAGE_KEY = 'allWorksData'; 

const HomePage: NextPage<Props> = ({ works: worksData }) => {
  const router = useRouter(); 
  const { type = 'all', tag } = router.query;
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(worksData));
        } catch (error) {
          console.error("Failed to save works data to localStorage:", error);
        }
    }
  }, [worksData]); 
  
  const handleTypeChange = (newType: string) => {
    const newQuery: any = { ...router.query, type: newType };
    if (newType === 'all') delete newQuery.type;

    router.push({
      pathname: router.pathname,
      query: newQuery,
    }, undefined, { shallow: true });
    setIsTypeOpen(false);
  };

  const selectedTags = Array.isArray(tag) ? tag : (tag ? [tag] : []);
  
  const allWorks = worksData
  .map(data => new Work(data))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredWorks = allWorks.filter(work => {
    // Type 필터링
    const typeMatch = type === 'all' || work.workType === type;

    // Tag 필터링
    let tagMatch = true;
    if (selectedTags.length > 0) {
        tagMatch = selectedTags.every(selectedTag => 
            work.tags.includes(selectedTag)
        );
      }
      
      return typeMatch && tagMatch;
    });
  const newTags = [...selectedTags];
  const toggleTag = (targetTag: string) => {
    const currentTagIndex = newTags.indexOf(targetTag);

    if (currentTagIndex > -1) {
      newTags.splice(currentTagIndex, 1);
    } else {
      newTags.push(targetTag);
    }
    
    const newQuery = { ...router.query };
    delete newQuery.tag;
    if (newTags.length > 0) newQuery.tag = newTags;
    
    router.push({
      pathname: router.pathname,
      query: newQuery,
    }, undefined, { shallow: true });
    setIsTagOpen(false); 
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
      <Head>
        <title>GANPANJIP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.navContainer}>
          {/* Type 섹션 */}
          <nav className={styles.typeNav}>
            <h3 
              className={styles.typeBtn} 
              onClick={() => {
                setIsTypeOpen(!isTypeOpen);
                setIsTagOpen(false); 
              }}
            >
              <span className={styles.capitalize}> Type: {type} </span>
              <span className={styles.arrow}> {isTypeOpen ? '▴' : '▾'}</span>
            </h3>
            {isTypeOpen && (
              <div className={styles.dropdownList}>
                {['all', 'work', 'original'].map((t) => (
                  <div key={t} onClick={() => handleTypeChange(t)} className={styles.dropdownItem}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </nav>

          {/* Tag 섹션 */}
          <nav className={styles.tagNav}>
            <h3 
              className={styles.tagBtn} 
              onClick={() => {
                setIsTagOpen(!isTagOpen);
                setIsTypeOpen(false); 
              }}
            >
              Tag {selectedTags.length > 0 ? `: ${selectedTags.join(', ')}` : ''}
              <span className={styles.arrow}> {isTagOpen ? '▴' : '▾'}</span>
            </h3>
            {isTagOpen && (
              <div className={styles.dropdownList}>
                <button 
                  onClick={() => { clearTags(); setIsTagOpen(false); }} 
                  className={`${styles.dropdownItem} ${selectedTags.length === 0 ? styles.tagActive : ''}`}
                > All </button>
                {PREDEFINED_TAGS.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`${styles.dropdownItem} ${selectedTags.includes(tag) ? styles.tagActive : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </nav>
          </div>
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