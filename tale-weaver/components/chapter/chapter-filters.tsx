"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chapter } from "@/types/story";
import { Search, ArrowUpDown } from "lucide-react";

interface ChapterFiltersProps {
  onSearch: (query: string) => void;
  onStatusChange: (status: Chapter['status'] | 'all') => void;
  onSortChange: (sort: 'order' | 'word-count' | 'updated') => void;
}

export function ChapterFilters({ onSearch, onStatusChange, onSortChange }: ChapterFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索章节..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select onValueChange={(value) => onSortChange(value as 'order' | 'word-count' | 'updated')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order">章节顺序</SelectItem>
            <SelectItem value="word-count">字数</SelectItem>
            <SelectItem value="updated">更新时间</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => onStatusChange(value as Chapter['status'] | 'all')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部章节</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 