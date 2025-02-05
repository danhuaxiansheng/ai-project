'use client'

import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"

export default function SystemPrompt() {
  const [expanded, setExpanded] = useState(false)
  
  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        onClick={() => setExpanded(!expanded)}
        className="w-full justify-start"
      >
        {expanded ? '收起' : '展开'}系统说明
      </Button>
      
      {expanded && (
        <div className="p-4 rounded-lg bg-muted mt-2">
          <h3 className="font-bold mb-2">使用说明</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>选择不同角色进行对话</li>
            <li>每个角色都有其特定职责</li>
            <li>可以随时切换角色获取不同视角的建议</li>
            <li>系统会保持对话上下文</li>
          </ul>
        </div>
      )}
    </div>
  )
} 