"use client";

import { Character } from "@/types/character";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CharacterCard({ character, isSelected, onClick, onEdit, onDelete }: CharacterCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // 防止菜单点击触发卡片点击
    if ((e.target as HTMLElement).closest('.character-menu')) {
      return;
    }
    onClick();
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer hover:shadow transition-shadow group",
        isSelected && "border-primary"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{character.name}</h4>
            <div className="character-menu opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    编辑
                  </DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确定要删除这个角色吗？</AlertDialogTitle>
                        <AlertDialogDescription>
                          此操作将永久删除"{character.name}"，此操作无法撤销。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={onDelete}
                          className="bg-red-600 hover:bg-red-700"
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
          <p className="text-sm text-muted-foreground line-clamp-1">
            {character.description}
          </p>
        </div>
        <div className={cn(
          "text-xs px-2 py-1 rounded-full",
          character.role === 'protagonist' && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
          character.role === 'antagonist' && "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
          character.role === 'supporting' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        )}>
          {{
            protagonist: '主角',
            antagonist: '反派',
            supporting: '配角'
          }[character.role]}
        </div>
      </div>
    </Card>
  );
} 