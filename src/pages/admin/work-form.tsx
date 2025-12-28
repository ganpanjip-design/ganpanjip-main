import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../../styles/Admin.module.css';
import { WorkData, ContentBlock, MediaItem } from '../../models/Work';
import ImageUploader from '../../components/admin/ImageUploader';
import { PREDEFINED_TAGS } from '../../constants/tags';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
type GridLayout = 'grid-1'|'grid-2'|'grid-3'|'grid-4';

interface MainVideoState {
    url: string;
    file?: File;
}

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
  const router = useRouter();
  const { id } = router.query;
  const isEditMode = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mainVideo, setMainVideo] = useState<MainVideoState>({ url: '' });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

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

  useEffect(() => {
    if (id && typeof id === 'string') {
      setIsLoading(true);
      fetch(`${API_URL}/works/${id}`)
        .then(res => res.json())
        .then(data => {
            setFormData({
                ...data,
                date: data.date,
                tags: data.tags || [],
            });
            setMainVideo({ url: data.mainVideoUrl || '' });
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

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
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const addContentBlock = () => {
    const newBlock: ContentBlock = { type: 'text', layout: 'grid-1', items: [], text: '' };
    setFormData(prev => ({ ...prev, data: [...prev.data, newBlock] }));
  };
  const updateContentBlock = (index: number, updatedBlock: ContentBlock) => {
    const newData = [...formData.data];
    newData[index] = updatedBlock;
    setFormData(prev => ({ ...prev, data: newData }));
  };
  const removeContentBlock = (index: number) => {
    setFormData(prev => ({ ...prev, data: prev.data.filter((_, i) => i !== index) }));
  };

  const moveContentBlock = (index: number, direction: 'up' | 'down') => {
    const newData = [...formData.data];
    if (direction === 'up') {
        if (index === 0) return; 
        [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
    } else {
        if (index === newData.length - 1) return;
        [newData[index], newData[index + 1]] = [newData[index + 1], newData[index]];
    }
    setFormData(prev => ({ ...prev, data: newData }));
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
          ...block, type, 
          items: (type === 'image' || type === 'gif' || type === 'video') ? block.items : [],
          text: (type === 'text') ? block.text : '' 
      };
      updateContentBlock(index, updatedBlock);
  };
  const handleTextChange = (index: number, value: string) => {
      const block = formData.data[index];
      const updatedBlock = { ...block, text: value }; 
      updateContentBlock(index, updatedBlock);
  };

  const handleMainVideoSelect = (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      setMainVideo({ url: previewUrl, file: file });
  };
  const handleThumbnailSelect = (file: File) => {
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, thumbnail: previewUrl }));
      setThumbnailFile(file);
  };
  const handleContentMediaSelect = (index: number, file: File) => {
    const block = formData.data[index];
    const previewUrl = URL.createObjectURL(file);
    const newItem: MediaItem = { url: previewUrl, caption: '', file: file };
    const layoutCount = getLayoutCount(block.layout as GridLayout);
    const currentItems = block.items || [];
    let updatedItems: MediaItem[] = [];

    if (layoutCount === 1) {
        updatedItems = [newItem];
    } else if (currentItems.length < layoutCount) {
        updatedItems = [...currentItems, newItem];
    } else {
        alert(`이미 ${layoutCount}개의 미디어가 등록되었습니다. 기존 미디어를 덮어씁니다.`);
        updatedItems = [...currentItems.slice(0, layoutCount - 1), newItem];
    }
    updateContentBlock(index, { ...block, items: updatedItems });
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
      try {
          const res = await axios.get(`${API_URL}/works/presigned-url`, {
              params: { filename: file.name }
          });

          const { presignedUrl, fileUrl } = res.data;

          await axios.put(presignedUrl, file, {
              headers: { 
                  'Content-Type': file.type 
              }
          });

          return fileUrl;

      } catch (error) {
          console.error('S3 Upload Error:', error);
          alert('파일 업로드 중 오류가 발생했습니다.');
          throw error;
      }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
        let finalThumbnailUrl = formData.thumbnail;
        if (thumbnailFile) {
            finalThumbnailUrl = await uploadFileToS3(thumbnailFile);
        }

        let finalMainVideoUrl = mainVideo.url;
        if (mainVideo.file) {
            finalMainVideoUrl = await uploadFileToS3(mainVideo.file);
        }

        const finalData = await Promise.all(formData.data.map(async (block) => {
            if (!block.items || block.items.length === 0) return block;
            const newItems = await Promise.all(block.items.map(async (item) => {
                if (item.file) {
                    const s3Url = await uploadFileToS3(item.file);
                    return { ...item, url: s3Url, file: undefined }; 
                }
                return item;
            }));
            return { ...block, items: newItems };
        }));

        const payload = {
            ...formData,
            thumbnail: finalThumbnailUrl,
            mainVideoUrl: finalMainVideoUrl,
            data: finalData
        };

        const method = isEditMode ? 'PUT' : 'POST'; 
        const url = isEditMode ? `${API_URL}/works/${id}` : `${API_URL}/works`;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if(response.ok) {
            alert(isEditMode ? '수정되었습니다.' : '등록되었습니다.');
            router.push('/admin/work-list');
        } else {
            throw new Error('서버 오류');
        }

    } catch (error) {
        console.error('Submit failed:', error);
        alert('업로드 및 저장 중 오류가 발생했습니다.');
    } finally {
        setIsUploading(false);
    }
  };

  if (isLoading) return <div className={styles.loadingText}>데이터 불러오는 중...</div>;
  
  return (
    <div className={styles.formContainer}>
      {isUploading && (
          <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
              display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '1.5rem'
          }}>
              파일 업로드 및 저장 중입니다... 잠시만 기다려주세요.
          </div>
      )}

      <h2 style={{marginBottom: '20px'}}>{isEditMode ? '게시물 수정' : '새 게시물 작성'}</h2>
      
      <form onSubmit={handleSubmit} className={styles.workForm}>
        <div className={styles.formGroup}>
          <label>제목: 썸네일 제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={styles.input} />
        </div>
        
        <div className={styles.formGroup}>
            <label>메인 비디오 파일</label>
            <ImageUploader onFileSelect={handleMainVideoSelect} /> 
            {mainVideo.url && (
                <div className={styles.previewContainer} style={{ marginTop: '10px' }}>
                    <video src={mainVideo.url} controls style={{ width: '100%', maxWidth: '400px' }} />
                </div>
            )}
        </div>
        <div className={styles.formGroup}>
          <label>서브 제목: 게시물 클릭 시 보여짐</label>
          <input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleInputChange} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label>날짜</label>
          <input type="date" name="date" value={formData.date ? formData.date.split('T')[0] : ''} onChange={handleDateChange} required className={styles.input} />
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
          <label>태그</label>
          <div className={styles.tagContainer}>
            {formData.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag} <button type="button" onClick={() => removeTag(tag)}>x</button></span>
            ))}
          </div>
          <select onChange={handleTagSelect} value="" className={styles.select}>
            <option value="" disabled>태그 선택...</option>
            {PREDEFINED_TAGS.filter(tag => !formData.tags.includes(tag)).map(tag => (<option key={tag} value={tag}>{tag}</option>))}
          </select>
        </div>
        <div className={styles.formGroup}>
            <label>썸네일</label>
            <ImageUploader onFileSelect={handleThumbnailSelect} />
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

        <div className={styles.contentBlocks}>
            <h2>콘텐츠 블록</h2>
            {formData.data.map((block, index) => (
                <div key={index} className={styles.contentBlock}>
                    <div className={styles.blockHeader}>
                        <h4>Block {index + 1}</h4>
                        <div className={styles.blockControls}>
                            <button 
                                type="button" 
                                onClick={() => moveContentBlock(index, 'up')} 
                                disabled={index === 0}
                                className={styles.controlBtn}
                            >
                                ▲ 위로
                            </button>
                            <button 
                                type="button" 
                                onClick={() => moveContentBlock(index, 'down')} 
                                disabled={index === formData.data.length - 1}
                                className={styles.controlBtn}
                            >
                                ▼ 아래로
                            </button>
                            <button 
                                type="button" 
                                onClick={() => removeContentBlock(index)} 
                                className={`${styles.controlBtn} ${styles.dangerBtn}`}
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>블록 타입</label>
                        <select value={block.type} onChange={(e) => handleTypeChange(index, e.target.value as ContentBlock['type'])} className={styles.select}>
                            <option value="text">텍스트</option>
                            <option value="image">이미지</option>
                            <option value="gif">GIF</option>
                            <option value="video">비디오</option>
                        </select>
                    </div>

                    {block.type === 'text' && (
                        <div className={styles.formGroup}>
                            <label>텍스트 내용</label>
                            <textarea value={block.text || ''} onChange={(e) => handleTextChange(index, e.target.value)} className={styles.textarea}></textarea>
                        </div>
                    )}
                    
                    {(block.type === 'image' || block.type === 'gif' || block.type === 'video') && (
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

                            <div className={styles.formGroup}>
                                <label>미디어 파일 ({block.type === 'video' ? '영상' : '이미지'})</label>
                                <ImageUploader onFileSelect={(file) => handleContentMediaSelect(index, file)} />
                                <div className={styles.previewContainer}>
                                    {block.items?.map((item, itemIndex) => (
                                        <div key={itemIndex} style={{ display: 'inline-block', width: 'auto', margin: '5px' }}>
                                            {block.type === 'video' ? (
                                                <video 
                                                    src={item.url} 
                                                    controls 
                                                    className={styles.previewImage}
                                                    style={{ maxWidth: '200px', maxHeight: '150px' }} 
                                                />
                                            ) : (
                                                <img 
                                                    src={item.url} 
                                                    alt={`Content media ${itemIndex}`} 
                                                    className={styles.previewImage} 
                                                    style={{ maxWidth: '100px', height: 'auto' }} 
                                                />
                                            )}
                                            {item.file && <span style={{display:'block', fontSize:'0.8em', color:'blue'}}>* 저장 시 업로드됨</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}
            <button type="button" onClick={addContentBlock} className={styles.button}>+ 콘텐츠 블록 추가</button>
        </div>

        <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
            {isEditMode ? '게시물 수정 저장' : '게시물 등록'}
        </button>
      </form>
    </div>
  );
}