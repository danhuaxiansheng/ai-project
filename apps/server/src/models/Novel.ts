import mongoose, { Document, Schema } from "mongoose";

export interface NovelSetting {
  genre: string[];
  theme: string[];
  targetLength: number;
  style: string[];
  constraints: string[];
}

export interface Novel extends Document {
  title: string;
  description: string;
  status: "draft" | "creating" | "paused" | "completed";
  progress: number;
  currentChapter: number;
  totalChapters: number;
  settings: NovelSetting;
  createdAt: Date;
  updatedAt: Date;
}

const NovelSettingSchema = new Schema<NovelSetting>({
  genre: [String],
  theme: [String],
  targetLength: Number,
  style: [String],
  constraints: [String],
});

const NovelSchema = new Schema<Novel>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["draft", "creating", "paused", "completed"],
    default: "draft",
  },
  progress: { type: Number, default: 0 },
  currentChapter: { type: Number, default: 0 },
  totalChapters: { type: Number, required: true },
  settings: { type: NovelSettingSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const NovelModel = mongoose.model<Novel>("Novel", NovelSchema);
