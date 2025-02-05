'use client'

import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import ChatMessage from './ChatMessage'
import RoleSelector from './RoleSelector'
import { roles } from '@/lib/roles/config'

interface Message {
  role: 'user' | 'assistant'
  content: string
  roleType?: string // 用于标识不同的AI角色
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentRole, setCurrentRole] = useState(roles[0].id)

  const handleSend = async () => {
    if (!input.trim()) return

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')

    const selectedRole = roles.find(r => r.id === currentRole)
    const aiResponse: Message = {
      role: 'assistant',
      content: `我是${selectedRole?.name}，已收到您的消息。我将根据我的职责："${selectedRole?.description}"来协助您。`,
      roleType: selectedRole?.name
    }
    
    setMessages(prev => [...prev, aiResponse])
  }

  const handleRoleSelect = (roleId: string) => {
    setCurrentRole(roleId)
    const selectedRole = roles.find(r => r.id === roleId)
    if (selectedRole) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `您好，我是${selectedRole.name}。我的职责是：${selectedRole.description}`,
        roleType: selectedRole.name
      }])
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <RoleSelector onSelect={handleRoleSelect} currentRole={currentRole} />
      <div className="flex flex-col h-[60vh] border rounded-lg">
        {/* 消息显示区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        
        {/* 输入区域 */}
        <div className="border-t p-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="请输入您的创作想法..."
            className="flex-1"
          />
          <Button onClick={handleSend}>发送</Button>
        </div>
      </div>
    </div>
  )
} 