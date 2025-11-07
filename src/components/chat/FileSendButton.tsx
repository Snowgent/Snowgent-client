import { useRef, useState } from 'react';
import { apiClient } from '../../api/api';
import axios from 'axios';

interface UploadResponse {
  filename: string;
  url: string;
}

const FileSendButton = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
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
    setUploadedFile(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name);

      const response = await apiClient.post<UploadResponse>('/chat/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response data:', response.data);
      console.log('Response data type:', typeof response.data);
      console.log('Response data keys:', Object.keys(response.data || {}));

      // 응답 데이터 검증
      if (!response.data) {
        throw new Error('응답 데이터가 없습니다.');
      }

      if (typeof response.data === 'string') {
        console.warn('응답이 JSON이 아닌 문자열입니다:', response.data);
        throw new Error('서버 응답 형식이 올바르지 않습니다.');
      }

      if (!response.data.filename || !response.data.url) {
        console.error('응답 데이터 형식 오류:', response.data);
        throw new Error('응답에 filename 또는 url이 없습니다.');
      }

      console.log('Upload success:', response.data);
      setUploadedFile(response.data);
      setUploadStatus(`업로드 성공! (${response.data.filename})`);

      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);

      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.data);
        console.error('Axios error status:', error.response?.status);
        const message =
          error.response?.data?.message || error.response?.statusText || error.message;
        const status = error.response?.status || '';
        setUploadStatus(`업로드 실패${status ? ` (${status})` : ''}: ${message}`);
      } else {
        setUploadStatus(error instanceof Error ? error.message : '업로드 실패');
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
        className="rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {uploading ? '업로드 중...' : '📎 CSV 파일 업로드'}
      </button>
      {uploadStatus && (
        <div className="flex flex-col gap-1">
          <p
            className={`text-sm ${uploadStatus.includes('성공') ? 'text-green-600' : 'text-red-600'}`}
          >
            {uploadStatus}
          </p>
          {uploadedFile && (
            <a
              href={uploadedFile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 underline hover:text-blue-700"
            >
              파일 보기
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default FileSendButton;
