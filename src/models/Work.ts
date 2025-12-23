export interface MediaItem {
  url: string;      // 미리보기용 Blob URL -> 업로드 후 S3 URL로 바뀜
  caption?: string; 
  file?: File;    
}

export interface ContentBlock {
  type: 'image' | 'gif' | 'video' | 'text';
  layout?: 'grid-1' | 'grid-2' | 'grid-3' | 'grid-4';
  items?: MediaItem[];
  text?: string;
}

// API로부터 받는 순수 데이터 객체의 형태를 정의하는 인터페이스
export interface WorkData {
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
  mainVideoUrl?: string; // 메인 비디오 URL (optional로 선언하여 데이터가 없을 때도 오류 방지)

  data: ContentBlock[]; 
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
  mainVideoUrl?: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.mainVideoUrl = (data as any).mainVideoUrl;
    this.data = data.data;
  }

  // 예시: 날짜 포맷을 변경하는 getter 메소드
  get formattedDate(): string {
    const dateObj = new Date(this.date);
    return dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\.$/, '');
  }
}