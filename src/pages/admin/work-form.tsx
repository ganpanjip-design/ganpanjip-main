import { useState, FormEvent, ChangeEvent } from 'react';
import styles from '../../styles/Admin.module.css';
import { WorkData, ContentBlock, MediaItem } from '../../models/Work'; // Work 모델 import
import ImageUploader from '../../components/admin/ImageUploader'; // ImageUploader 경로
import { PREDEFINED_TAGS } from '../../constants/tags';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
type GridLayout = 'grid-1'|'grid-2'|'grid-3'|'grid-4';
const getLayoutCount = (layout: GridLayout): number => {
    switch (layout) {
        case 'grid-1': return 1;
        case 'grid-2': return 2;
        case 'grid-3': return 3;
        case 'grid-4': return 4;
        default: return 1;
    }
};

export default function WorkFormPage() {
  const [formData, setFormData] = useState<Omit<WorkData, 'id'> & { mainVideoUrl: string }>({
    title: '',
    subtitle: '',
    date: new Date().toISOString(),
    workType: 'work',
    owner: '',
    tags: [],
    thumbnail: '',
    descriptionKo: '',
    descriptionEn: '',
    mainVideoUrl: '', 
    data: [],
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({...prev, date: new Date(e.target.value).toISOString()}));
  };

  const handleTagSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTag = e.target.value;
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
      type: 'text', 
      layout: 'grid-1',
      items: [],
      text: '', 
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
    
    if (block.type === 'image' || block.type === 'gif') {
        const newItem: MediaItem = { url, caption: '' };
        const layoutCount = getLayoutCount(block.layout as GridLayout);
        const currentItems = block.items || [];
        
        let updatedItems: MediaItem[] = [];

        if (layoutCount === 1) {
            // grid-1은 무조건 덮어쓰기
            updatedItems = [newItem];
        } else if (currentItems.length < layoutCount) {
            // 설정된 그리드 개수보다 작으면 추가
            updatedItems = [...currentItems, newItem];
        } else {
            // 그리드 개수를 초과하면 경고 후 마지막 아이템 덮어쓰기
            alert(`이미 ${layoutCount}개의 미디어가 등록되었습니다. 기존 미디어를 덮어씁니다.`);
            updatedItems = [...currentItems.slice(0, layoutCount - 1), newItem];
        }

        const updatedBlock = { ...block, items: updatedItems };
        updateContentBlock(index, updatedBlock);
    }
  };

  const handleLayoutChange = (index: number, layout: GridLayout) => {
      const block = formData.data[index];
      const layoutCount = getLayoutCount(layout);
      const updatedItems = (block.items || []).slice(0, layoutCount);

      const updatedBlock = { ...block, layout, items: updatedItems };
      updateContentBlock(index, updatedBlock);
  };
  
  const handleTypeChange = (index: number, type: ContentBlock['type']) => {
      const block = formData.data[index];
      const updatedBlock: ContentBlock = { 
          ...block, 
          type, 
          items: (type === 'image' || type === 'gif') ? block.items : [],
          text: (type === 'text') ? block.text : '' 
      };
      updateContentBlock(index, updatedBlock);
  };
  
  const handleTextChange = (index: number, value: string) => {
      const block = formData.data[index];
      const updatedBlock = { ...block, text: value }; 
      updateContentBlock(index, updatedBlock);
  };

  const removeContentBlock = (index: number) => {
    setFormData(prev => ({
        ...prev,
        data: prev.data.filter((_, i) => i !== index)
    }));
  };
  
  const handleMainVideoUpload = (url: string) => {
      setFormData(prev => ({...prev, mainVideoUrl: url}));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const payload = { ...formData };
    
    try {
      const response = await fetch(`${API_URL}/works`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });
      if(response.ok) {
          alert('게시물이 성공적으로 등록되었습니다.');
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
        <div className={styles.formGroup}>
          <label>제목: 썸네일 제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
            <label>메인 비디오 파일</label>
            <ImageUploader onUploadSuccess={handleMainVideoUpload} /> 
            {formData.mainVideoUrl && (
                <div className={styles.previewContainer} style={{ marginTop: '10px' }}>
                    <video
                        src={formData.mainVideoUrl}
                        controls
                        style={{ width: '100%', maxWidth: '400px', height: 'auto', border: '1px solid #ccc' }} 
                    />
                </div>
            )}
        </div>
        
        <div className={styles.formGroup}>
          <label>서브 제목: 게시물 클릭 시 보여짐</label>
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
                        <label>블록 타입</label>
                        <select value={block.type} onChange={(e) => handleTypeChange(index, e.target.value as ContentBlock['type'])} className={styles.select}>
                            <option value="text">텍스트</option>
                            <option value="image">이미지</option>
                            <option value="gif">GIF</option>
                        </select>
                    </div>

                    {/* 텍스트 입력 필드 */}
                    {block.type === 'text' && (
                        <div className={styles.formGroup}>
                            <label>텍스트 내용</label>
                            <textarea value={block.text || ''} onChange={(e) => handleTextChange(index, e.target.value)} className={styles.textarea}></textarea>
                        </div>
                    )}
                    
                    {/* 미디어 관련 필드 */}
                    {(block.type === 'image' || block.type === 'gif') && (
                        <>
                            <div className={styles.formGroup}>
                                <label>그리드 레이아웃</label>
                                <select value={block.layout} onChange={(e) => handleLayoutChange(index, e.target.value as GridLayout)} className={styles.select}>
                                    <option value="grid-1">1개씩</option>
                                    <option value="grid-2">2개씩</option>
                                    <option value="grid-3">3개씩</option>
                                    <option value="grid-4">4개씩</option>
                                </select>
                            </div>
                            <p style={{fontSize: '0.9em', color: '#666', marginBottom: '10px'}}>
                                현재 등록된 파일: {(block.items || []).length} / {getLayoutCount(block.layout as GridLayout)}개
                                {(block.items || []).length === getLayoutCount(block.layout as GridLayout) && 
                                    <span style={{color: 'green', marginLeft: '10px'}}> (가득 참)</span>
                                }
                            </p>

                            <div className={styles.formGroup}>
                                <label>미디어 파일</label>
                                <ImageUploader onUploadSuccess={(url) => handleContentMediaUpload(index, url)} />
                                <div className={styles.previewContainer}>
                                    {block.items?.map((item, itemIndex) => (
                                        // itemIndex와 block.layout을 사용하여 레이아웃 결정 (CSS에서 처리되지만, 여기서도 확인 가능)
                                        <div key={itemIndex} style={{ display: 'inline-block', width: 'auto', margin: '5px' }}>
                                            <img src={item.url} alt={`Content media ${itemIndex}`} className={styles.previewImage} style={{ maxWidth: '100px', height: 'auto' }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                    
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