import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import { getWorks } from '../api/worksApi';
import { Work, WorkData } from '../models/Work';
import { PREDEFINED_TAGS } from '../constants/tags';
import WorkCard from '../components/works/WorkCard';

import Header from '../components/common/Header'; 
import RightHeader from '../components/common/RightHeader';
import Footer from '../components/common/Footer';
import AboutPage from '../components/sections/about';
import ContactPage from '../components/sections/contact';

import styles from '../styles/Home.module.css';

interface Props {
  works: WorkData[];
}

const STORAGE_KEY = 'allWorksData';

const HomePage: NextPage<Props> = ({ works: worksData }) => {
  const router = useRouter();
  const { type = 'all', tag } = router.query;
  
  // 상태 관리: 필터 열림 여부, 우측 뷰, 그리고 모바일 전용 드로워 메뉴 열림 상태
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const [rightView, setRightView] = useState<'about' | 'contact'>('about');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 모바일 드로워 토글 상태

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(worksData)); } catch (e) {} 
    }
  }, [worksData]);

  // 페이지 이동(라우팅) 시 모바일 메뉴가 열려있다면 자동으로 닫아주는 효과
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.asPath]);

  const handleTypeChange = (newType: string) => {
    const newQuery: any = { ...router.query, type: newType };
    if (newType === 'all') delete newQuery.type;
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true }); 
    setIsTypeOpen(false);
  };

  const selectedTags = Array.isArray(tag) ? tag : (tag ? [tag] : []); 
  const filteredWorks = React.useMemo(() => {
  const allWorks = worksData
    .map(data => new Work(data))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allWorks.filter(work => 
    (type === 'all' || work.workType === type) && 
    (selectedTags.length === 0 || selectedTags.every(t => work.tags.includes(t)))
  );
}, [worksData, type, tag]);
  const toggleTag = (targetTag: string) => {
    const newTags = [...selectedTags];
    const idx = newTags.indexOf(targetTag);
    idx > -1 ? newTags.splice(idx, 1) : newTags.push(targetTag); 
    const newQuery = { ...router.query };
    newTags.length > 0 ? (newQuery.tag = newTags) : delete newQuery.tag; 
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true }); 
  };

  return (
    <div>
      <Head>
        <title>GANPANJIP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header onMenuClick={() => setIsMenuOpen(true)} />

      <div className={styles['main-wrapper']}>
      <section className={styles['container-left']}>
        <div className={styles.navContainer}>
          <nav className={styles.typeNav}>
          <h3 className={styles.typeBtn} onClick={() => { setIsTypeOpen(!isTypeOpen); setIsTagOpen(false); }}>
            <span className={styles.capitalize}>Type: {type}</span>
            <span className={styles.arrow}>{isTypeOpen ? '▴' : '▾'}</span>
          </h3>
          {isTypeOpen && (
            <div className={styles.dropdownList}>
              {['all', 'work', 'original'].map(t => (
                <div key={t} onClick={() => handleTypeChange(t)} className={styles.dropdownItem}>{t.toUpperCase()}</div> 
              ))}
            </div>
          )}
          </nav>
          <nav className={styles.tagNav}>
          <h3 className={styles.tagBtn} onClick={() => { setIsTagOpen(!isTagOpen); setIsTypeOpen(false); }}>
            Tag {selectedTags.length > 0 ? `: ${selectedTags.join(', ')}` : ''}
            <span className={styles.arrow}>{isTagOpen ? '▴' : '▾'}</span>
          </h3>
          {isTagOpen && (
            <div className={styles.dropdownList}>
              <button onClick={() => { router.push('/', undefined, { shallow: true }); setIsTagOpen(false); }} className={styles.dropdownItem}>All</button> 
              {PREDEFINED_TAGS.map(t => (
                <button key={t} onClick={() => toggleTag(t)} className={`${styles.dropdownItem} ${selectedTags.includes(t) ? styles.tagActive : ''}`}>{t}</button> 
              ))}
            </div>
          )}
          </nav>
        </div>
        <div className={styles['scroll-area']}>
          <main className={styles.main}>
            <div className={styles.grid}>
              {filteredWorks.map(work => <WorkCard key={work.id} work={work} />)}
            </div>
          </main>
        </div>
      </section>

      <section className={styles['container-right']}>
        <RightHeader view={rightView} setView={setRightView} />
        <div className={styles['scroll-area']}>
          <div className={styles.rightContent}>
            {rightView === 'about' ? <AboutPage /> : <ContactPage />}
          </div>
        </div>
      </section>

      <div className={`${styles['mobile-drawer']} ${isMenuOpen ? styles['is-open'] : ''}`}>
        <div className={styles['drawer-content']}>
          <div className={styles['drawer-scroll']}>
            {rightView === 'about' ? <AboutPage /> : <ContactPage />}
          </div>
            <div className={styles['drawer-tabs']}>
            <button className={styles['drawer-close-btn']} onClick={() => setIsMenuOpen(false)}>×</button>
            <span 
              className={rightView === 'about' ? styles['tab-active'] : styles['tab-inactive']}
              onClick={() => setRightView('about')}
            >
              About
            </span>
            <span 
              className={rightView === 'contact' ? styles['tab-active'] : styles['tab-inactive']}
              onClick={() => setRightView('contact')}
            >
              Contact
            </span>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const works = await getWorks();
    return { props: { works: JSON.parse(JSON.stringify(works)) } }; 
  } catch (e) {
    return { props: { works: [] } }; 
  }
};

export default HomePage;