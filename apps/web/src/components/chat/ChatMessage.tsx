interface MessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
    roleType?: string
    roleId?: string
  }
}

export default function ChatMessage({ message }: MessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2 text-xs">
          {message.roleType?.[0]}
        </div>
      )}
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        {message.roleType && (
          <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
            <span className="font-medium">{message.roleType}</span>
            <span className="opacity-50">|</span>
            <span className="text-[10px] opacity-50">{getTimestamp()}</span>
          </div>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}

function getTimestamp() {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
} 