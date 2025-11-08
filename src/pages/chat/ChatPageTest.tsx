import { useEffect, useRef, useState } from 'react';
import Navigation from '../../components/Navigation';
import FileSendButton from '../../components/chat/FileSendButton';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPageTest() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      role: 'assistant',
      content: '안녕하세요! Snowgent입니다❄️ \n재고 데이터 파일을 업로드 해주세요',
    },
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const socket = new WebSocket('wss://backendbase.site/ws/chat');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected');
    };

    socket.onmessage = (event) => {
      if (event.data.includes('[bedrock stream done]')) {
        console.log('Stream done:', event.data);
        return;
      }

      try {
        const json = JSON.parse(event.data);
        if (json.type === 'session') {
          setSessionId(json.session_id);
          console.log(`${sessionId}`);
          console.log(`Session ID: ${json.session_id}`);
          return;
        }
      } catch {
        /* not JSON */
      }

      // 어시스턴트 메시지 처리
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        // 마지막 메시지가 어시스턴트이고 내용이 비어있으면 업데이트
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content === '') {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + event.data,
          };
          return updated;
        }

        // 마지막 메시지가 어시스턴트이면 이어붙이기
        if (lastMessage && lastMessage.role === 'assistant') {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + event.data,
          };
          return updated;
        }

        // 새로운 어시스턴트 메시지 생성
        return [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: event.data,
          },
        ];
      });
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = (event) => {
      console.log('Disconnected:', event.code, event.reason);
    };

    return () => {
      socket.close();
    };
  }, []);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 입력창 자동 높이 조절
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleUploadSuccess = () => {
    setIsFileUploaded(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: '재고 파일이 업로드 완료되었습니다. \n 채팅을 시작해보세요 !',
      },
    ]);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socketRef.current) return;

    if (socketRef.current.readyState === WebSocket.OPEN) {
      // 사용자 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'user',
          content: text,
        },
      ]);

      // WebSocket으로 전송
      socketRef.current.send(JSON.stringify({ role: 'user', content: text }));
      setInput('');
    } else {
      console.error('WebSocket이 연결되지 않음');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <Navigation />
      <div className="flex flex-1 flex-col overflow-hidden p-5">
        {/* 메시지 목록 */}
        {/* 파일 업로드 버튼 - 업로드 전에만 표시 */}
        {!isFileUploaded && (
          <div className="shrink-0">
            <FileSendButton onUploadSuccess={handleUploadSuccess} />
          </div>
        )}
        <div className="flex-1 overflow-y-auto pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === 'user' ? 'bg-[#0D2D84] text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="break-words whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력창 - 업로드 후에만 표시 */}
        {isFileUploaded && (
          <div className="flex shrink-0 gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="메시지를 입력하세요"
              rows={1}
              className="max-h-20 flex-1 resize-none overflow-hidden rounded-xl border px-3 py-4 text-xl outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              className="rounded-xl bg-[#0D2D84] px-6 text-lg text-white hover:bg-[#0a2366]"
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
