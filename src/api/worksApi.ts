import { Work, WorkData } from '../models/Work';

// [핵심] 상황에 따라 주소를 다르게 주는 함수
const API_URL = `${process.env.EC2_API_URL}/api`;

export type WorkType = 'work' | 'original';

// 모든 작품 목록
export const getWorks = async (): Promise<Work[]> => {
  if (!API_URL) {
    console.error("API URL Error: URL이 설정되지 않았습니다. 환경변수를 확인하세요.");
    throw new Error("API URL is not defined");
  }

  const response = await fetch(`${API_URL}/works`);
  if (!response.ok) {
    throw new Error(`Failed to fetch works: ${response.status}`);
  }
  const data: WorkData[] = await response.json();

  return data.map(item => new Work(item));
};

// 특정 ID의 작품 반환
export const getWorkById = async (id: string): Promise<Work | null> => {
  if (!API_URL) {
    throw new Error("API URL is not defined");
  }

  const response = await fetch(`${API_URL}/works/${id}`);
  if (!response.ok) {
    return null;
  }
  const data: WorkData = await response.json();
  
  return new Work(data);
};