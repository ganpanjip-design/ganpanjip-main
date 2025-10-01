import { useState, FormEvent, ChangeEvent } from 'react';
import styles from '../../styles/Admin.module.css';
import { WorkData, ContentBlock, MediaItem } from '../../models/Work'; // Work 모델 import
import ImageUploader from '../../components/admin/ImageUploader'; // ImageUploader 경로

// 미리 정의된 태그 리스트
const PREDEFINED_TAGS = [
  'ALL', '2D', '3D', 'Line Drawing Animation', 'Branding', 'Music Video', 
  'Content Planning', 'VR', 'Cinematic', 'Graphic Design', 'Midea Art', 
  'SNS Contents', 'Character Modeling'
];

export default function WorkFormPage() {
  const [formData, setFormData] = useState<Omit<WorkData, 'id'>>({
    title: '',
    subtitle: '',
    date: new Date().toISOString(), // DB 저장을 위해 ISO 문자열 사용
    workType: 'work',
    owner: '',
    tags: [],
    thumbnail: '',
    descriptionKo: '',
    descriptionEn: '',
    data: [],
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 날짜 입력(YYYY-MM-DD)을 ISO 문자열로 변환하여 저장
    setFormData(prev => ({...prev, date: new Date(e.target.value).toISOString()}));
  };

  // 드롭다운에서 태그를 선택했을 때 처리하는 함수
  const handleTagSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
    // 선택된 태그가 유효하고, 아직 목록에 없는 경우에만 추가
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, selectedTag] }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addContentBlock = () => {
    const newBlock: ContentBlock = {
      type: 'image', // 기본 타입
      layout: 'grid-4', // 기본 레이아웃
      items: [],
    };
    setFormData(prev => ({ ...prev, data: [...prev.data, newBlock] }));
  };

  const updateContentBlock = (index: number, updatedBlock: ContentBlock) => {
    const newData = [...formData.data];
    newData[index] = updatedBlock;
    setFormData(prev => ({ ...prev, data: newData }));
  };
  
  const handleContentMediaUpload = (index: number, url: string) => {
    const block = formData.data[index];
    const newItem: MediaItem = { url, caption: '' };
    const updatedBlock = { ...block, items: [...(block.items || []), newItem] };
    updateContentBlock(index, updatedBlock);
  };
  
  const handleLayoutChange = (index: number, layout: 'grid-1'|'grid-2'|'grid-4') => {
      const block = formData.data[index];
      const updatedBlock = { ...block, layout };
      updateContentBlock(index, updatedBlock);
  };

  const removeContentBlock = (index: number) => {
    setFormData(prev => ({
        ...prev,
        data: prev.data.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // 백엔드로 데이터 전송 로직 (추후 API 엔드포인트 생성 필요)
      const response = await fetch('/api/works', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
      });
      if(response.ok) {
          alert('게시물이 성공적으로 등록되었습니다.');
          // 폼 초기화 또는 페이지 이동
      } else {
          throw new Error('서버에서 오류가 발생했습니다.');
      }
    } catch (error) {
        console.error('Failed to submit work:', error);
        alert('게시물 등록에 실패했습니다.');
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.workForm}>
        {/* 기본 정보 */}
        <div className={styles.formGroup}>
          <label>제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label>서브 제목</label>
          <input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleInputChange} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label>날짜</label>
          <input type="date" name="date" value={formData.date.split('T')[0]} onChange={handleDateChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
            <label>작품 타입</label>
            <div className={styles.radioGroup}>
                <label><input type="radio" name="workType" value="work" checked={formData.workType === 'work'} onChange={handleInputChange}/> Work</label>
                <label><input type="radio" name="workType" value="original" checked={formData.workType === 'original'} onChange={handleInputChange}/> Original</label>
            </div>
        </div>
        <div className={styles.formGroup}>
          <label>주최자 (Owner)</label>
          <input type="text" name="owner" value={formData.owner} onChange={handleInputChange} required className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label>태그 선택</label>
          <div className={styles.tagContainer}>
            {formData.tags.map(tag => (
              <span key={tag} className={styles.tag}>
                {tag} <button type="button" onClick={() => removeTag(tag)}>x</button>
              </span>
            ))}
          </div>
          <select onChange={handleTagSelect} value="" className={styles.select}>
            <option value="" disabled>태그를 선택하세요...</option>
            {/* 이미 선택된 태그는 드롭다운 목록에서 제외 */}
            {PREDEFINED_TAGS.filter(tag => !formData.tags.includes(tag)).map(tag => (
                <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
            <label>썸네일</label>
            <ImageUploader onUploadSuccess={url => setFormData(prev => ({...prev, thumbnail: url}))} />
            {formData.thumbnail && <img src={formData.thumbnail} alt="Thumbnail preview" className={styles.previewImage} />}
        </div>
        <div className={styles.formGroup}>
            <label>설명글 (Ko)</label>
            <textarea name="descriptionKo" value={formData.descriptionKo || ''} onChange={handleInputChange} className={styles.textarea}></textarea>
        </div>
        <div className={styles.formGroup}>
            <label>설명글 (En)</label>
            <textarea name="descriptionEn" value={formData.descriptionEn || ''} onChange={handleInputChange} className={styles.textarea}></textarea>
        </div>

        {/* 콘텐츠 블록 */}
        <div className={styles.contentBlocks}>
            <h2>콘텐츠 블록</h2>
            {formData.data.map((block, index) => (
                <div key={index} className={styles.contentBlock}>
                    <h4>Block {index + 1}</h4>
                    <div className={styles.formGroup}>
                        <label>그리드 레이아웃</label>
                        <select value={block.layout} onChange={(e) => handleLayoutChange(index, e.target.value as any)} className={styles.select}>
                            <option value="grid-1">1개씩</option>
                            <option value="grid-2">2개씩</option>
                            <option value="grid-4">4개씩</option>
                        </select>
                    </div>
                     <div className={styles.formGroup}>
                        <label>미디어 파일</label>
                        <ImageUploader onUploadSuccess={(url) => handleContentMediaUpload(index, url)} />
                        <div className={styles.previewContainer}>
                            {block.items?.map((item, itemIndex) => (
                                <img key={itemIndex} src={item.url} alt={`Content media ${itemIndex}`} className={styles.previewImage} />
                            ))}
                        </div>
                    </div>
                    <button type="button" onClick={() => removeContentBlock(index)} className={`${styles.button} ${styles.dangerButton}`}>블록 삭제</button>
                </div>
            ))}
            <button type="button" onClick={addContentBlock} className={styles.button}>콘텐츠 블록 추가</button>
        </div>

        <button type="submit" className={`${styles.button} ${styles.submitButton}`}>게시물 저장</button>
      </form>
    </div>
  );
}
