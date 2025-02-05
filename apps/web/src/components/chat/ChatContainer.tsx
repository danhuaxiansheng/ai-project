'use client'

import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import ChatMessage from './ChatMessage'

interface Message {
  role: 'user' | 'assistant'
  content: string
  roleType?: string // 用于标识不同的AI角色
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // TODO: 这里后续需要添加与AI的交互逻辑
    const aiResponse: Message = {
      role: 'assistant',
      content: '我是小说创作助手，已收到您的消息。',
      roleType: 'writer'
    }
    
    setMessages(prev => [...prev, aiResponse])
  }

  return (
    <div className="flex flex-col h-[80vh] border rounded-lg">
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
  )
} 