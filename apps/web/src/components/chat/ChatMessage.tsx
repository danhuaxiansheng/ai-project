import { Avatar } from "@workspace/ui/components/avatar"
import { RoleMessage } from "@/types/role"

interface ChatMessageProps {
  message: RoleMessage
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.roleId === 'user'

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar
        className="w-8 h-8"
        src={isUser ? '/avatars/user.png' : `/avatars/${message.roleId}.png`}
        fallback={isUser ? 'U' : message.roleId[0].toUpperCase()}
      />
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div className="mb-1 text-sm text-gray-500">
          {isUser ? '您' : message.roleId}
        </div>
        
        <div className={`p-3 rounded-lg ${
          isUser 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {message.content}
        </div>
        
        {message.type !== 'text' && (
          <div className="mt-1 text-xs text-gray-400">
            {message.type}
          </div>
        )}
      </div>
    </div>
  )
} 