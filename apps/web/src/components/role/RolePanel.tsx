'use client'

import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Switch } from "@workspace/ui/components/switch"
import { RoleType } from '@/types/role'

interface RoleCardProps {
  id: string
  name: string
  type: RoleType
  description: string
  isActive: boolean
  onToggle: (id: string) => void
}

function RoleCard({ id, name, type, description, isActive, onToggle }: RoleCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={() => onToggle(id)}
        />
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </Card>
  )
}

export default function RolePanel() {
  const [activeRoles, setActiveRoles] = useState<Set<string>>(new Set())

  const handleRoleToggle = (id: string) => {
    setActiveRoles(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold">角色管理</h2>
        <div className="space-x-2">
          <Button variant="outline">全部启用</Button>
          <Button variant="outline">全部禁用</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 这里将使用 roleManager 中的角色数据 */}
        <RoleCard
          id="product_manager"
          name="产品经理"
          type="management"
          description="需求分析和任务分配，把控创作方向"
          isActive={activeRoles.has('product_manager')}
          onToggle={handleRoleToggle}
        />
        {/* 添加更多角色卡片 */}
      </div>
    </div>
  )
} 