"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CharacterTagManagerProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  onSuggestionsChange?: (suggestions: string[]) => void;
}

export function CharacterTagManager({
  tags,
  onChange,
  suggestions = [],
  onSuggestionsChange
}: CharacterTagManagerProps) {
  const [newTag, setNewTag] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !tags.includes(tag)
  );

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      onChange(newTags);
      
      // 如果是新标签，添加到建议列表
      if (!suggestions.includes(tag) && onSuggestionsChange) {
        onSuggestionsChange([...suggestions, tag]);
      }
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex flex-wrap gap-2">
          {tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline">+{tags.length - 3}</Badge>
          )}
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              管理标签
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>管理角色标签</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="添加新标签"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(newTag);
                    }
                  }}
                />
                <Button onClick={() => addTag(newTag)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索标签..."
              />

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">当前标签</h4>
                  <ScrollArea className="h-24">
                    <div className="flex flex-wrap gap-2">
                      {filteredTags.map(tag => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">建议标签</h4>
                  <ScrollArea className="h-24">
                    <div className="flex flex-wrap gap-2">
                      {filteredSuggestions.map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => addTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
} 