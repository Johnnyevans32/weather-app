import React, { useState } from 'react';
import { processAIChat } from '../lib/api/api';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import Navigation from '../components/Navigation';

interface Message {
  text: string;
  sender: 'user' | 'ai';
  link?: string | null;
}

const ChatPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');

      try {
        const aiResponse = await processAIChat(userMessage.text);
        const aiMessage: Message = { 
          text: aiResponse.response,
          sender: 'ai',
          link: aiResponse.link,
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);

      } catch (error) {
        console.error("Error processing AI chat:", error);
        const errorMessage: Message = { text: "Error: Could not process your request.", sender: 'ai' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleLinkClick = (link: string) => {
    navigate(link);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <Navigation />
      <div className="flex flex-col h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p>{msg.text}</p>
                {msg.link && msg.sender === 'ai' && (
                  <button 
                    onClick={() => handleLinkClick(msg.link!)} 
                    className="text-blue-700 underline mt-1 text-sm"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex p-4 border-t">
          <Input
            className="flex-1 mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the weather..."
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 