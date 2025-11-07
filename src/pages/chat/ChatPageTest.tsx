import { useEffect, useRef, useState } from 'react';

export default function ChatPageTest() {
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const socket = new WebSocket('wss://backendbase.site/ws/chat');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Connected');
      setOutput((prev) => prev + 'Connected\n');
    };

    socket.onmessage = (event) => {
      // bedrock stream done 메시지는 콘솔에만 표시
      if (event.data.includes('[bedrock stream done]')) {
        console.log('Stream done:', event.data);
        return;
      }

      try {
        const json = JSON.parse(event.data);
        if (json.type === 'session') {
          setSessionId(json.session_id);
          setOutput((prev) => prev + `[세션 ID: ${json.session_id}]\n`);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h3>Chat Test</h3>
      {sessionId && <p style={{ color: '#666' }}>세션 ID: {sessionId}</p>}
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
      <br />
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '8px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          보내기
        </button>
      </div>
    </div>
  );
}
