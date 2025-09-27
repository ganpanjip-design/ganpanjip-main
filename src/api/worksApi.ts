// src/api/worksApi.ts

import { Work, WorkData } from '../models/Work';

// 기존 환경 변수 이름을 그대로 사용합니다.
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// projectType 대신 workType으로 타입명을 변경하여 일관성을 높입니다.
export type WorkType = 'work' | 'original';

// 모든 작품 목록을 가져오는 함수
export const getWorks = async (workType?: WorkType): Promise<Work[]> => {
  // API URL이 설정되지 않았을 경우 에러를 발생시켜 문제를 빠르게 인지하도록 합니다.
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined in .env file");
  }

  let url = `${API_URL}/works`;
  if (workType) {
    // index.tsx의 context.query.type과 일치시키기 위해 쿼리 파라미터를 'type'으로 변경합니다.
    url += `?type=${workType}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch works');
  }
  const data: WorkData[] = await response.json();

  // 기존 코드의 패턴을 유지: API 함수 내에서 Work 클래스 객체로 변환하여 반환
  return data.map(item => new Work(item));
};

// 특정 ID의 작품 하나를 가져오는 함수 (새로운 스키마에 맞게 업데이트)
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