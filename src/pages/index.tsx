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

interface Props {
  works: WorkData[];
}

const HomePage: NextPage<Props> = ({ works: worksData }) => {
  const router = useRouter(); // router 훅 사용
  const { type, tag } = router.query;
  const selectedTags = Array.isArray(tag) ? tag : (tag ? [tag] : []);
  
  // WorkData를 Work 클래스 인스턴스로 변환
  const allWorks = worksData.map(data => new Work(data));

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

  // 태그 클릭 시 URL 쿼리를 업데이트하는 함수
  const toggleTag = (targetTag: string) => {
    // 현재 선택된 태그 목록을 복사
    let newTags = [...selectedTags];
    const currentTagIndex = newTags.indexOf(targetTag);

    if (currentTagIndex > -1) {
      // 이미 선택된 태그면 제거 (토글 off)
      newTags.splice(currentTagIndex, 1);
    } else {
      // 선택되지 않은 태그면 추가 (토글 on)
      newTags.push(targetTag);
    }
    
    // 새로운 쿼리 객체 생성
    const newQuery = { ...router.query };
    delete newQuery.tag; // 기존 tag 쿼리 삭제

    if (newTags.length > 0) {
        // 새로운 태그 목록 추가
        newQuery.tag = newTags;
    }
    
    // 라우터 푸시로 URL 업데이트
    router.push({
      pathname: router.pathname,
      query: newQuery,
    }, undefined, { shallow: true }); // shallow: true는 SSR을 다시 거치지 않고 URL만 변경하여 클라이언트 필터링 속도를 유지합니다.
  };

  // 'All' 버튼 클릭
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
    const worksData = JSON.parse(JSON.stringify(works)); //JSON 변환

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