'use client'

import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import ChatMessage from './ChatMessage'
import { roles } from '@/lib/roles/config'

interface Message {
  role: 'user' | 'assistant'
  content: string
  roleType?: string
  roleId?: string
}

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // 模拟各个角色依次响应
  const handleRolesResponse = async (userInput: string) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    
    // 管理层角色先响应
    for (const role of roles.filter(r => r.type === 'management')) {
      await delay(1000) // 模拟API调用延迟
      const response: Message = {
        role: 'assistant',
        content: generateRoleResponse(role, userInput, messages),
        roleType: role.name,
        roleId: role.id
      }
      setMessages(prev => [...prev, response])
    }

    // 创作层角色响应
    for (const role of roles.filter(r => r.type === 'creation')) {
      await delay(1000)
      const response: Message = {
        role: 'assistant',
        content: generateRoleResponse(role, userInput, messages),
        roleType: role.name,
        roleId: role.id
      }
      setMessages(prev => [...prev, response])
    }

    // 质控层角色最后响应
    for (const role of roles.filter(r => r.type === 'quality')) {
      await delay(1000)
      const response: Message = {
        role: 'assistant',
        content: generateRoleResponse(role, userInput, messages),
        roleType: role.name,
        roleId: role.id
      }
      setMessages(prev => [...prev, response])
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      role: 'user',
      content: input
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    await handleRolesResponse(input)
    setIsProcessing(false)
  }

  return (
    <div className="flex flex-col h-[80vh] border rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
      
      <div className="border-t p-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSend()}
          placeholder={isProcessing ? "AI角色正在思考中..." : "请输入您的创作想法..."}
          disabled={isProcessing}
          className="flex-1"
        />
        <Button 
          onClick={handleSend} 
          disabled={isProcessing}
        >
          {isProcessing ? "处理中..." : "发送"}
        </Button>
      </div>
    </div>
  )
}

// 根据角色生成响应
function generateRoleResponse(role: typeof roles[0], userInput: string, messages: Message[]): string {
  const context = messages.map(m => `${m.roleType ? `[${m.roleType}]` : '[用户]'}: ${m.content}`).join('\n')
  
  switch (role.type) {
    case 'management':
      return `根据我的职责"${role.description}"，我的建议是：\n` +
        `1. 市场分析：这个创意的受众群体...\n` +
        `2. 商业价值：从变现角度考虑...\n` +
        `3. 发展方向：建议重点关注...`

    case 'creation':
      return `作为${role.name}，我认为：\n` +
        `1. 情节设计：可以考虑...\n` +
        `2. 人物塑造：建议增加...\n` +
        `3. 世界观构建：可以融入...`

    case 'quality':
      return `从${role.name}的角度，我发现：\n` +
        `1. 优点：...\n` +
        `2. 待改进：...\n` +
        `3. 建议：...`

    default:
      return '收到您的消息，我会认真思考并给出建议。'
  }
} 