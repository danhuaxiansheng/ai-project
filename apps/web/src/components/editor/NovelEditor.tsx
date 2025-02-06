'use client'

import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"

export default function NovelEditor() {
  const [content, setContent] = useState('')

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex justify-between mb-4">
        <div className="space-x-2">
          <Button variant="outline" size="sm">保存</Button>
          <Button variant="outline" size="sm">导出</Button>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm">撤销</Button>
          <Button variant="outline" size="sm">重做</Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 border rounded-lg resize-none"
            placeholder="开始创作您的小说..."
          />
        </div>

        <div className="w-80 border rounded-lg p-4">
          <h3 className="font-bold mb-4">角色反馈</h3>
          <div className="space-y-4">
            {/* 角色反馈将在这里显示 */}
            <p className="text-gray-500">暂无反馈</p>
          </div>
        </div>
      </div>
    </div>
  )
} 