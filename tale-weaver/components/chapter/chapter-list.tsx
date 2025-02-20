"use client";

import { useState, useMemo } from "react";
import { Chapter } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FileText, ChevronRight, MoreVertical, Trash, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChapterEditor } from "./chapter-editor";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChapterPreview } from "./chapter-preview";
import { ExportButton } from "./export-button";
import { ChapterStats } from "./chapter-stats";
import { ChapterFilters } from "./chapter-filters";
import { toast } from "@/components/ui/use-toast";

interface ChapterListProps {
  storyId: string;
  chapters: Chapter[];
  onUpdate: (chapters: Chapter[]) => void;
}

export function ChapterList({ storyId, chapters, onUpdate }: ChapterListProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Chapter['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'word-count' | 'updated'>('order');

  const sortedChapters = useMemo(() => {
    const sorted = [...chapters];
    switch (sortBy) {
      case 'word-count':
        return sorted.sort((a, b) => b.wordCount - a.wordCount);
      case 'updated':
        return sorted.sort((a, b) => b.updatedAt - a.updatedAt);
      default:
        return sorted.sort((a, b) => a.order - b.order);
    }
  }, [chapters, sortBy]);

  const filteredChapters = useMemo(() => {
    return sortedChapters.filter(chapter => {
      const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || chapter.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sortedChapters, searchQuery, statusFilter]);

  const handleAddChapter = () => {
    setSelectedChapter(null);
    setIsEditing(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsEditing(true);
  };

  const handleSave = async (chapter: Chapter) => {
    try {
      const newChapters = selectedChapter
        ? chapters.map(c => c.id === chapter.id ? chapter : c)
        : [...chapters, { ...chapter, storyId, order: chapters.length }];
      
      await onUpdate(newChapters);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save chapter:', error);
      toast({
        title: "错误",
        description: "保存章节失败",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sortedChapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // 更新顺序
    const updatedChapters = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    onUpdate(updatedChapters);
  };

  const handleDelete = (chapterId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedChapters = chapters
      .filter(c => c.id !== chapterId)
      .map((c, index) => ({ ...c, order: index }));
    onUpdate(updatedChapters);
  };

  return (
    <div className="space-y-6">
      <ChapterStats chapters={chapters} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">章节列表</h3>
            <div className="flex items-center gap-2">
              <ExportButton
                chapters={chapters}
                selectedChapter={selectedChapter}
              />
              <Button size="sm" onClick={handleAddChapter}>
                <Plus className="h-4 w-4 mr-2" />
                添加章节
              </Button>
            </div>
          </div>

          <ChapterFilters
            onSearch={setSearchQuery}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
          />

          <ScrollArea className="h-[600px]">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="chapters">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredChapters.map((chapter, index) => (
                      <Draggable
                        key={chapter.id}
                        draggableId={chapter.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              className={`p-4 cursor-pointer hover:shadow transition-shadow ${
                                selectedChapter?.id === chapter.id ? 'border-primary' : ''
                              }`}
                              onClick={() => handleEditChapter(chapter)}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-1">
                                  <h4 className="font-medium">{chapter.title}</h4>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{chapter.wordCount} 字</span>
                                    <span>·</span>
                                    <span>{chapter.status === 'published' ? '已发布' : '草稿'}</span>
                                  </div>
                                </div>
                                <div onClick={e => e.stopPropagation()}>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedChapter(chapter);
                                        setIsPreview(true);
                                      }}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        预览
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onSelect={(e) => e.preventDefault()}
                                          >
                                            <Trash className="h-4 w-4 mr-2" />
                                            删除章节
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>确认删除章节？</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              此操作将永久删除该章节，无法恢复。
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>取消</AlertDialogCancel>
                                            <AlertDialogAction
                                              className="bg-red-600 hover:bg-red-700"
                                              onClick={(e) => handleDelete(chapter.id, e)}
                                            >
                                              删除
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {chapters.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p>点击上方按钮添加章节</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="md:col-span-2">
          {isEditing ? (
            <ChapterEditor
              chapter={selectedChapter}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setSelectedChapter(null);
              }}
            />
          ) : isPreview && selectedChapter ? (
            <ChapterPreview
              chapter={selectedChapter}
              onClose={() => {
                setIsPreview(false);
                setSelectedChapter(null);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12 mb-4" />
              <p>选择左侧章节进行编辑，或创建新章节</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 