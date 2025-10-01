import { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUploadSuccess(response.data.url);
    } catch (error) {
      console.error('File upload failed:', error);
      setUploadError('파일 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*, video/*" 
        onChange={handleFileChange} 
        disabled={isUploading} 
      />
      {isUploading && <p>업로드 중...</p>}
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
}

