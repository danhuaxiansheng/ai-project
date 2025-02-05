export interface Message {
  role: 'user' | 'assistant'
  content: string
  roleType?: string
}

export interface Role {
  id: string
  name: string
  description: string
  type: 'management' | 'creation' | 'quality'
} 