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
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        {message.roleType && (
          <div className="text-xs text-muted-foreground mb-1">
            {message.roleType}
          </div>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
} 