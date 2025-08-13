import { useState, useEffect } from 'react';
import { messageAPI, Message } from '../utils/api';
import { getUser, removeToken, removeUser } from '../utils/auth';

interface ChatWindowProps {
  onLogout: () => void;
}

export default function ChatWindow({ onLogout }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = getUser();

  const fetchMessages = async () => {
    try {
      const response = await messageAPI.getMessages();
      setMessages(response.data);
    } catch (err: any) {
      setError('Failed to fetch messages');
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Poll for new messages every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await messageAPI.sendMessage({ content: newMessage });
      setMessages([...messages, response.data]);
      setNewMessage('');
      setError('');
    } catch (err: any) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    onLogout();
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user?.profile_picture && (
            <img 
              src={user.profile_picture} 
              alt="Profile" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
              }}
            />
          )}
          <h3>Welcome, {user?.username}!</h3>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ 
        height: '400px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '15px',
        overflowY: 'auto',
        backgroundColor: '#fff',
        marginBottom: '20px'
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={{ 
              marginBottom: '15px', 
              padding: '10px',
              backgroundColor: message.user_id === user?.id ? '#e3f2fd' : '#f5f5f5',
              borderRadius: '8px',
              marginLeft: message.user_id === user?.id ? '20%' : '0',
              marginRight: message.user_id === user?.id ? '0' : '20%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <img 
                  src={message.profile_picture || 'https://via.placeholder.com/30'} 
                  alt="Profile" 
                  style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/30';
                  }}
                />
                <strong>{message.username}</strong>
                <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              <p style={{ margin: '0', marginLeft: '38px' }}>{message.content}</p>
            </div>
          ))
        )}
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ 
            flex: 1, 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px'
          }}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !newMessage.trim()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}