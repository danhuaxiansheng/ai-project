'use client'

import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"
import { roles } from '@/lib/roles/config'

interface RoleSelectorProps {
  onSelect: (roleId: string) => void
  currentRole?: string
}

export default function RoleSelector({ onSelect, currentRole }: RoleSelectorProps) {
  const [selectedType, setSelectedType] = useState<'management' | 'creation' | 'quality'>('management')
  
  const roleTypes = {
    management: '管理层',
    creation: '创作层',
    quality: '质控层'
  }

  const filteredRoles = roles.filter(role => role.type === selectedType)

  return (
    <div className="mb-4">
      <div className="flex gap-2 mb-4">
        {Object.entries(roleTypes).map(([type, label]) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => setSelectedType(type as any)}
            size="sm"
          >
            {label}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {filteredRoles.map(role => (
          <Button
            key={role.id}
            variant={currentRole === role.id ? "default" : "outline"}
            onClick={() => onSelect(role.id)}
            className="justify-start"
            size="sm"
          >
            <span className="truncate">{role.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
} 