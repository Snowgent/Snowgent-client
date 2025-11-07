import axios from 'axios';
import { useRef, useState } from 'react';

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

      // 개발환경
      // const uploadUrl = '/chat/upload';

      // 배포환경
      const uploadUrl = 'https://backendbase.site/chat/upload';
      if (!uploadUrl) {
        throw new Error('업로드 URL이 설정되지 않았습니다.');
      }

      console.log('Uploading file:', file.name, 'to:', uploadUrl);

      const response = await axios.post<UploadResponse>(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: false,
      });

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
