"use client";

import { useState } from "react";
import { Outline } from "@/types/story";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronDown, Plus, MoreVertical, Trash, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OutlineTreeProps {
  outlines: Outline[];
  selectedId?: string;
  onSelect: (outline: Outline) => void;
  onAdd: (parentId?: string) => void;
  onDelete: (id: string) => void;
  onDragEnd: (result: any) => void;
}

interface OutlineNodeProps extends Omit<OutlineTreeProps, 'onDragEnd'> {
  outline: Outline;
  level: number;
  index: number;
}

function OutlineNode({ outline, level, index, selectedId, onSelect, onAdd, onDelete }: OutlineNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = outline.children && outline.children.length > 0;

  return (
    <Draggable draggableId={outline.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="space-y-2"
        >
          <Card
            className={`p-2 hover:shadow transition-shadow ${
              selectedId === outline.id ? 'border-primary' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: level * 20 }} />
              <div {...provided.dragHandleProps} className="cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {hasChildren && (
                  isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onSelect(outline)}
              >
                <div className="font-medium">{outline.title}</div>
                <div className="text-sm text-muted-foreground">
                  {outline.type === 'plot' ? '情节' : outline.type === 'scene' ? '场景' : '笔记'}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onAdd(outline.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    添加子节点
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={() => onDelete(outline.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
          {isExpanded && hasChildren && (
            <Droppable droppableId={`children-${outline.id}`}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="pl-4"
                >
                  {outline.children?.map((child, index) => (
                    <OutlineNode
                      key={child.id}
                      outline={child}
                      level={level + 1}
                      index={index}
                      selectedId={selectedId}
                      onSelect={onSelect}
                      onAdd={onAdd}
                      onDelete={onDelete}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  );
}

export function OutlineTree(props: OutlineTreeProps) {
  const { outlines, onDragEnd } = props;
  const rootOutlines = outlines.filter(o => !o.parentId);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="root">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {rootOutlines.map((outline, index) => (
              <OutlineNode
                key={outline.id}
                outline={outline}
                level={0}
                index={index}
                {...props}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 