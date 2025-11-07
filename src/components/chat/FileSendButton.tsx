import { useRef, useState } from 'react';
import { apiClient } from '../../api/api';
import axios from 'axios';

interface UploadResponse {
  filename: string;
  url: string;
}

interface FileSendButtonProps {
  onUploadSuccess?: () => void;
}

const FileSendButton = ({ onUploadSuccess }: FileSendButtonProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadStatus('CSV 파일만 업로드 가능합니다.');
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name);

      const response = await apiClient.post<UploadResponse>('/chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload success:', response.data);

      // 업로드 성공 콜백 호출
      onUploadSuccess?.();

      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.response?.statusText || error.message;
        const status = error.response?.status || '';
        setUploadStatus(`업로드 실패${status ? ` (${status})` : ''}: ${message}`);
      } else if (error instanceof Error) {
        setUploadStatus(`에러: ${error.message}`);
      } else {
        setUploadStatus('알 수 없는 에러가 발생했습니다.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      <button
        onClick={handleButtonClick}
        disabled={uploading}
        className="my-2 w-fit rounded-md bg-blue-500 p-4 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {uploading ? '업로드 중...' : '📎파일 업로드'}
      </button>
      {uploadStatus && <p className="text-sm text-red-600">dd{uploadStatus}</p>}
    </div>
  );
};

export default FileSendButton;
