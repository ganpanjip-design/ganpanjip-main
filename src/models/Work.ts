// data 필드 내부의 MediaItem에 대한 인터페이스
export interface MediaItem {
  url: string;
  caption?: string; // 캡션은 선택적일 수 있음
}

// data 필드 내부의 ContentBlock에 대한 인터페이스
export interface ContentBlock {
  type: 'image' | 'gif' | 'video' | 'text'; // 콘텐츠 유형
  layout?: 'grid-1' | 'grid-2' | 'grid-4'; // 레이아웃 (갤러리 유형에만 사용)
  items?: MediaItem[]; // 미디어 아이템 목록 (갤러리 유형에만 사용)
  text?: string; // 텍스트 내용 (텍스트 유형에만 사용)
}

// API로부터 받는 순수 데이터 객체의 형태를 정의하는 인터페이스
export interface WorkData {
  id: string;
  title: string;
  subtitle?: string; // subtitle 추가 (선택적)
  date: string; // date 추가 (JSON으로 전달되므로 string 타입)
  workType: 'work' | 'original'; // projectType -> workType 이름 및 타입 변경
  owner: string; // author -> owner 이름 변경
  tags: string[];
  thumbnail: string;
  descriptionKo?: string;
  descriptionEn?: string;
  data: ContentBlock[]; // images -> data 구조 변경
}

// 프론트엔드에서 사용할 Work 클래스 (메소드 추가 등 확장성을 위해)
export class Work implements WorkData {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  workType: 'work' | 'original';
  owner: string;
  tags: string[];
  thumbnail: string;
  descriptionKo?: string;
  descriptionEn?: string;
  data: ContentBlock[];

  constructor(data: WorkData) {
    this.id = data.id;
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.date = data.date;
    this.workType = data.workType;
    this.owner = data.owner;
    this.tags = data.tags;
    this.thumbnail = data.thumbnail;
    this.descriptionKo = data.descriptionKo;
    this.descriptionEn = data.descriptionEn;
    this.data = data.data;
  }

  // 예시: 날짜 포맷을 변경하는 getter 메소드
  get formattedDate(): string {
    const dateObj = new Date(this.date);
    // 원하는 날짜 형식으로 반환 (예: 2025. 09. 27)
    return dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\.$/, ''); // 마지막 . 제거
  }
}