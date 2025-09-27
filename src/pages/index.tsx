// src/pages/index.tsx

import { GetServerSideProps, NextPage } from 'next';
import { getWorks } from '../api/worksApi';
import { Work, WorkData } from '../models/Work';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import WorkCard from '../components/works/WorkCard';
import styles from '../styles/Home.module.css';

interface Props {
  works: WorkData[];
}

const HomePage: NextPage<Props> = ({ works: worksData }) => {
  const works = worksData.map(data => new Work(data));

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <div className={styles.grid}>
          {works.length > 0 ? (
            works.map(work => <WorkCard key={work.id} work={work} />)
          ) : (
            <p>표시할 작품이 없습니다.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { type } = context.query;
  // projectType -> workType 변수명 변경 및 타입 체크
  const workType = type === 'work' || type === 'original' ? type : undefined;
  
  try {
    const works = await getWorks(workType);
    // JSON 직렬화 과정은 SSR에서 필수이므로 그대로 둡니다.
    const worksData = JSON.parse(JSON.stringify(works));

    return {
      props: {
        works: worksData,
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