interface MessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    roleType?: string
  }
}

export default function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
      }`}>
        {message.roleType && (
          <div className="text-xs text-gray-500 mb-1">
            {message.roleType}
          </div>
        )}
        <div>{message.content}</div>
      </div>
    </div>
  )
} 