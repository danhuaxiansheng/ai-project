"use client";

import { useState } from "react";
import { Outline } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, MoreVertical, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OutlineEditor } from "./outline-editor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OutlineTree } from "./outline-tree";
import { OutlineFilters } from "./outline-filters";
import { OutlinePreview } from "./outline-preview";
import { toast } from "@/components/ui/use-toast";

interface OutlineListProps {
  outlines: Outline[];
  chapters?: { id: string; title: string }[];
  onUpdate: (outlines: Outline[]) => void;
}

export function OutlineList({ outlines, chapters, onUpdate }: OutlineListProps) {
  const [selectedOutline, setSelectedOutline] = useState<Outline | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ parentId: '' });
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<Outline['type'] | 'all'>('all');
  const [isPreview, setIsPreview] = useState(false);

  const handleAddOutline = (parentId?: string) => {
    setSelectedOutline(null);
    setIsEditing(true);
    if (parentId) {
      setForm(prev => ({ ...prev, parentId }));
    }
  };

  const handleEditOutline = (outline: Outline) => {
    setSelectedOutline(outline);
    setIsEditing(true);
  };

  const buildOutlineTree = (outlines: Outline[]): Outline[] => {
    const outlineMap = new Map<string, Outline>();
    outlines.forEach(outline => {
      outlineMap.set(outline.id, { ...outline, children: [] });
    });

    const rootOutlines: Outline[] = [];
    outlines.forEach(outline => {
      const node = outlineMap.get(outline.id)!;
      if (outline.parentId && outlineMap.has(outline.parentId)) {
        const parent = outlineMap.get(outline.parentId)!;
        parent.children = parent.children || [];
        parent.children.push(node);
      } else {
        rootOutlines.push(node);
      }
    });

    return rootOutlines;
  };

  const handleDelete = (outlineId: string) => {
    const getDescendantIds = (outline: Outline): string[] => {
      const ids = [outline.id];
      if (outline.children) {
        outline.children.forEach(child => {
          ids.push(...getDescendantIds(child));
        });
      }
      return ids;
    };

    const outlineToDelete = outlines.find(o => o.id === outlineId);
    if (!outlineToDelete) return;

    const idsToDelete = getDescendantIds(outlineToDelete);
    const updatedOutlines = outlines.filter(o => !idsToDelete.includes(o.id));
    onUpdate(updatedOutlines);
  };

  const handleSave = async (outline: Outline) => {
    try {
      let newOutlines: Outline[];
      if (selectedOutline) {
        newOutlines = outlines.map(o => o.id === outline.id ? outline : o);
      } else {
        newOutlines = [...outlines, { 
          ...outline,
          parentId: form.parentId || undefined,
          order: outlines.length 
        }];
      }
      
      await onUpdate(newOutlines);
      setIsEditing(false);
      setForm({ parentId: '' });
    } catch (error) {
      console.error('Failed to save outline:', error);
      toast({
        title: "错误",
        description: "保存大纲失败",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorder = (list: Outline[], startIndex: number, endIndex: number): Outline[] => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;

    let newOutlines = [...outlines];

    if (sourceId === destinationId) {
      // 同一层级内的排序
      if (sourceId === 'root') {
        const rootOutlines = outlines.filter(o => !o.parentId);
        const reorderedRoot = reorder(
          rootOutlines,
          result.source.index,
          result.destination.index
        );
        newOutlines = outlines.map(o => {
          if (!o.parentId) {
            const newOrder = reorderedRoot.findIndex(r => r.id === o.id);
            return { ...o, order: newOrder };
          }
          return o;
        });
      } else {
        const parentId = sourceId.replace('children-', '');
        const children = outlines.filter(o => o.parentId === parentId);
        const reorderedChildren = reorder(
          children,
          result.source.index,
          result.destination.index
        );
        newOutlines = outlines.map(o => {
          if (o.parentId === parentId) {
            const newOrder = reorderedChildren.findIndex(r => r.id === o.id);
            return { ...o, order: newOrder };
          }
          return o;
        });
      }
    } else {
      // 跨层级的移动
      const item = outlines.find(o => o.id === result.draggableId);
      if (!item) return;

      const newParentId = destinationId === 'root' ? undefined : destinationId.replace('children-', '');
      newOutlines = outlines.map(o => {
        if (o.id === item.id) {
          return { ...o, parentId: newParentId };
        }
        return o;
      });
    }

    onUpdate(newOutlines);
  };

  // 过滤大纲
  const filteredOutlines = outlines.filter(outline => {
    const matchesSearch = outline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outline.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || outline.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // 构建树形结构
  const outlineTree = buildOutlineTree(filteredOutlines);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">大纲列表</h3>
          <Button size="sm" onClick={() => handleAddOutline()}>
            <Plus className="h-4 w-4 mr-2" />
            添加大纲
          </Button>
        </div>

        <OutlineFilters
          onSearch={setSearchQuery}
          onTypeChange={setTypeFilter}
        />

        <ScrollArea className="h-[600px]">
          <OutlineTree
            outlines={outlineTree}
            selectedId={selectedOutline?.id}
            onSelect={(outline) => {
              setSelectedOutline(outline);
              setIsPreview(true);
              setIsEditing(false);
            }}
            onAdd={handleAddOutline}
            onDelete={handleDelete}
            onDragEnd={handleDragEnd}
          />
        </ScrollArea>
      </div>

      <div className="md:col-span-2">
        {isEditing ? (
          <OutlineEditor
            outline={selectedOutline}
            chapters={chapters}
            parentId={form.parentId}
            onSave={handleSave}
            onCancel={() => {
              setIsEditing(false);
              setForm({ parentId: '' });
            }}
          />
        ) : isPreview && selectedOutline ? (
          <OutlinePreview
            outline={selectedOutline}
            chapters={chapters}
            onClose={() => {
              setIsPreview(false);
              setSelectedOutline(null);
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <p>选择左侧大纲进行编辑，或创建新大纲</p>
          </div>
        )}
      </div>
    </div>
  );
} 