"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CharacterCard({
  character,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}: CharacterCardProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-colors hover:bg-accent",
        isSelected && "border-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold">{character.name}</h3>
            <div
              className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                character.role === "protagonist" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                character.role === "antagonist" && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
                character.role === "supporting" && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              )}
            >
              {{
                protagonist: "主角",
                antagonist: "反派",
                supporting: "配角",
              }[character.role]}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {character.description}
          </p>
        </div>
        <div className="flex gap-1 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认删除</AlertDialogTitle>
                <AlertDialogDescription>
                  确定要删除角色 "{character.name}" 吗？此操作无法撤销。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {character.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {character.tags.map((tag, index) => (
            <div
              key={`${character.id}-${tag}-${index}`}
              className="text-xs px-2 py-0.5 bg-secondary rounded-full"
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
} 