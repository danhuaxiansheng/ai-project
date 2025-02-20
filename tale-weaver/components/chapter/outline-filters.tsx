"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Outline } from "@/types/story";

interface OutlineFiltersProps {
  onSearch: (query: string) => void;
  onTypeChange: (type: Outline['type'] | 'all') => void;
}

export function OutlineFilters({ onSearch, onTypeChange }: OutlineFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索大纲..."
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Select onValueChange={(value) => onTypeChange(value as Outline['type'] | 'all')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="类型筛选" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部类型</SelectItem>
          <SelectItem value="plot">情节</SelectItem>
          <SelectItem value="scene">场景</SelectItem>
          <SelectItem value="note">笔记</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
} 