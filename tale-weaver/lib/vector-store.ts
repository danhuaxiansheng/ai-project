import { openDB } from "idb";

interface VectorRecord {
  text: string;
  embedding: number[];
  type: string;
  reference_id: string;
  timestamp: number;
}

export class VectorStore {
  private store: Map<string, VectorRecord>;
  private dbPromise: Promise<any>;

  constructor() {
    this.store = new Map();
    this.dbPromise = this.initDB();
    this.loadFromIndexedDB();
  }

  private initDB() {
    if (typeof window === "undefined") return Promise.resolve(null);
    return openDB("vector-store", 1, {
      upgrade(db) {
        db.createObjectStore("vectors");
      },
    });
  }

  private async loadFromIndexedDB() {
    if (typeof window === "undefined") return;

    try {
      const db = await this.dbPromise;
      if (!db) return;

      const records = await db.get("vectors", "records");
      if (records) {
        records.forEach((record: VectorRecord) => {
          this.store.set(record.reference_id, record);
        });
      }
    } catch (error) {
      console.error("Error loading vector store:", error);
    }
  }

  private async saveToIndexedDB() {
    if (typeof window === "undefined") return;

    try {
      const db = await this.dbPromise;
      if (!db) return;

      const data = Array.from(this.store.values());
      await db.put("vectors", data, "records");
    } catch (error) {
      console.error("Error saving vector store:", error);
    }
  }

  async add(records: VectorRecord[]) {
    records.forEach((record) => {
      this.store.set(record.reference_id, record);
    });
    await this.saveToIndexedDB();
  }

  async search(queryEmbedding: number[], limit: number = 5) {
    const results = Array.from(this.store.values())
      .map((record) => ({
        ...record,
        score: this.cosineSimilarity(queryEmbedding, record.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

export const vectorStore = new VectorStore();
