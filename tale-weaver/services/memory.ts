import { getDb, vectorStore } from "@/lib/db-config";
import { Story, StorySession, StoryMessage } from "@/types/story";

export class MemorySystem {
  private encoder: any;

  constructor() {
    this.initEncoder();
  }

  private async initEncoder() {
    if (typeof window !== "undefined") {
      try {
        const { pipeline } = await import("@xenova/transformers");
        this.encoder = await pipeline(
          "feature-extraction",
          "Xenova/multilingual-e5-small"
        );
      } catch (error) {
        console.error("Failed to load transformer:", error);
        // 使用简单的回退方案
        this.encoder = {
          async encode(text: string) {
            // 简单的词袋模型
            const words = text.toLowerCase().split(/\s+/);
            const vector = new Array(384).fill(0);
            words.forEach((word, i) => {
              vector[i % 384] = word.length;
            });
            return vector;
          },
        };
      }
    } else {
      // 服务器端使用简单的回退方案
      this.encoder = {
        async encode(text: string) {
          const vector = new Array(384).fill(0);
          const chars = text.split("");
          chars.forEach((char, i) => {
            vector[i % 384] = char.charCodeAt(0);
          });
          return vector;
        },
      };
    }
  }

  private async generateEmbedding(text: string) {
    await this.initEncoder();
    if (this.encoder.encode) {
      return await this.encoder.encode(text);
    }
    const output = await this.encoder(text, {
      pooling: "mean",
      normalize: true,
    });
    return Array.from(output.data);
  }

  async storeMemory(content: string, type: string, referenceId: string) {
    const embedding = await this.generateEmbedding(content);
    await vectorStore.add([
      {
        text: content,
        embedding,
        type,
        reference_id: referenceId,
        timestamp: Date.now(),
      },
    ]);
  }

  async searchMemories(query: string, limit = 5) {
    const queryEmbedding = await this.generateEmbedding(query);
    return await vectorStore.search(queryEmbedding, limit);
  }

  // 结构化存储
  async createStory(story: Story) {
    const db = await getDb();
    db.run(
      `
      INSERT INTO stories (id, title, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        story.id,
        story.title,
        story.description,
        story.createdAt,
        story.updatedAt,
      ]
    );

    await this.storeMemory(
      `创建了新故事: ${story.title}\n${story.description || ""}`,
      "story",
      story.id
    );
  }

  async createSession(session: StorySession) {
    const stmt = sqlite.prepare(`
      INSERT INTO sessions (id, story_id, title, type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      session.id,
      session.storyId,
      session.title,
      session.type,
      session.createdAt,
      session.updatedAt
    );
    await this.storeMemory(
      `在故事中创建了新会话: ${session.title}`,
      "session",
      session.id
    );
  }

  async addMessage(message: StoryMessage) {
    const stmt = sqlite.prepare(`
      INSERT INTO messages (id, session_id, role, content, timestamp, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      message.id,
      message.sessionId,
      message.role,
      message.content,
      message.timestamp,
      message.metadata ? JSON.stringify(message.metadata) : null
    );
    await this.storeMemory(message.content, "message", message.id);
  }

  // 混合查询
  async getRelevantContext(query: string, sessionId: string) {
    // 获取向量相似度结果
    const vectorResults = await this.searchMemories(query);

    // 获取最近的消息历史
    const stmt = sqlite.prepare(`
      SELECT * FROM messages 
      WHERE session_id = ? 
      ORDER BY timestamp DESC 
      LIMIT 10
    `);
    const recentMessages = stmt.all(sessionId);

    return {
      semanticContext: vectorResults,
      recentContext: recentMessages,
    };
  }
}

export const memorySystem = new MemorySystem();
