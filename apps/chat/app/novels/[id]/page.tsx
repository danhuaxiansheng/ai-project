"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Novel } from "@/types/novel";
import { Role } from "@/types/role";
import { novelAPI } from "@/lib/api/novel";
import { roleAPI } from "@/lib/api/role";
import { TaskPanel } from "@/components/task/TaskPanel";
import { toast } from "@/components/ui/use-toast";

export default function NovelDetailPage() {
  const params = useParams();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [novelData, rolesData] = await Promise.all([
          novelAPI.getNovelById(params.id as string),
          roleAPI.getAllRoles(),
        ]);
        setNovel(novelData);
        setRoles(rolesData);
        if (rolesData.length > 0) {
          setSelectedRole(rolesData[0]);
        }
      } catch (error) {
        toast({
          title: "错误",
          description: "加载数据失败",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [params.id]);

  if (!novel || !selectedRole) {
    return <div>加载中...</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{novel.title}</h1>
        <p className="text-muted-foreground">{novel.description}</p>
      </div>
      <TaskPanel role={selectedRole} novel={novel} />
    </div>
  );
}
