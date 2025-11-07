import { useEffect, useRef, useState } from 'react';
import Navigation from '../../components/Navigation';

export default function ChatPageTest() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);
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
          return;
        }
      } catch {
        /* not JSON */
      }
      setOutput((prev) => prev + event.data + '\n');
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setOutput((prev) => prev + 'Error occurred\n');
    };

    socket.onclose = (event) => {
      console.log('Disconnected:', event.code, event.reason);
      setOutput((prev) => prev + `Disconnected: ${event.code}\n`);
    };

    return () => {
      socket.close();
    };
  }, []);

  // 자동 스크롤
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // 입력창 자동 높이 조절
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socketRef.current) return;

    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ role: 'user', content: text }));
      setInput('');
    } else {
      setOutput((prev) => prev + 'WebSocket이 연결되지 않음\n');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Navigation />
      <div className="flex h-full flex-col p-5">
        <textarea
          ref={outputRef}
          value={output}
          readOnly
          rows={15}
          style={{
            width: '100%',
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}
        />
        <div className="flex-1"></div>

        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="메세지를 입력하세요"
            rows={1}
            className="max-h-20 flex-5 resize-none overflow-hidden rounded-xl border px-3 py-4 text-xl outline-none"
          />
          <button
            onClick={sendMessage}
            className="flex-1 rounded-xl bg-[#0D2D84] text-lg text-white"
          >
            ▶
          </button>
        </div>
      </div>
    </>
  );
}
