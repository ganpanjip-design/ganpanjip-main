import { Work, WorkData } from '../models/Work';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export type WorkType = 'work' | 'original';

// 모든 작품 목록
export const getWorks = async (): Promise<Work[]> => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined in .env file");
  }

  const url = `${API_URL}/works`; 

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch works');
  }
  const data: WorkData[] = await response.json();

  return data.map(item => new Work(item));
};

// 특정 ID의 작품 반환
export const getWorkById = async (id: string): Promise<Work | null> => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined in .env file");
  }

  const response = await fetch(`${API_URL}/works/${id}`);
  if (!response.ok) {
    // 404 Not Found 등의 경우 null을 반환하도록 처리
    return null;
  }
  const data: WorkData = await response.json();
  
  // 순수 데이터를 Work 클래스 객체로 변환하여 반환
  return new Work(data);
};