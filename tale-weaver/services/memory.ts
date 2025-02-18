"use client";

import { Memory } from "@/types/memory";

class MemorySystem {
  private memories: Memory[] = [];

  async searchMemories(query: string, limit: number = 100): Promise<Memory[]> {
    // 临时返回所有记忆，后续可以实现实际的搜索逻辑
    return this.memories.slice(0, limit);
  }

  addMemory(memory: Memory) {
    this.memories.push(memory);
  }

  clearMemories() {
    this.memories = [];
  }
}

export const memorySystem = new MemorySystem();
