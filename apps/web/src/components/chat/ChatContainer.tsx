'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import ChatMessage from './ChatMessage'
import { roles } from '@/lib/roles/config'
import { RoleMessage } from '@/types/role'
import { ChatManager } from '@/lib/chat/chatManager'
import { RoleManager } from '@/lib/roles/roleManager'
import { EventBus } from '@/lib/events/eventBus'

export default function ChatContainer() {
  const [messages, setMessages] = useState<RoleMessage[]>([])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const roleManager = useMemo(() => new RoleManager(), [])
  const chatManager = useMemo(() => new ChatManager(roleManager), [roleManager])
  const eventBus = useMemo(() => EventBus.getInstance(), [])

  useEffect(() => {
    // 订阅消息更新
    const handleNewMessage = (message: RoleMessage) => {
      setMessages(prev => [...prev, message])
    }

    // 订阅错误处理
    const handleError = (error: { message: string }) => {
      setError(error.message)
      setIsProcessing(false)
    }

    eventBus.subscribe('chat:newMessage', handleNewMessage)
    eventBus.subscribe('chat:error', handleError)

    return () => {
      eventBus.unsubscribe('chat:newMessage', handleNewMessage)
      eventBus.unsubscribe('chat:error', handleError)
    }
  }, [eventBus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    setIsProcessing(true)
    setError(null)

    try {
      const userMessage: RoleMessage = {
        id: crypto.randomUUID(),
        roleId: 'user',
        content: input,
        timestamp: Date.now(),
        type: 'text'
      }
      setMessages(prev => [...prev, userMessage])

      await chatManager.processUserInput(input)
      setInput('')
    } catch (error) {
      setError('发送消息失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {error && (
        <div className="p-2 bg-red-100 text-red-600 text-center">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder={isProcessing ? "AI正在思考中..." : "输入您的创作内容..."}
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing}
            className={`px-4 py-2 rounded text-white ${
              isProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isProcessing ? '处理中...' : '发送'}
          </button>
        </div>
      </form>
    </div>
  )
}

// 根据角色生成响应
function generateRoleResponse(role: typeof roles[0], userInput: string, messages: RoleMessage[]): string {
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