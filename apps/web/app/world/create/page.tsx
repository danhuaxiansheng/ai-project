import { WorldGeneratorLayout } from "@/components/world/WorldGeneratorLayout";

export default function CreateWorldPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">创建新世界</h1>
        <p className="text-muted-foreground mb-6">
          通过设置参数，生成一个独特的虚拟世界
        </p>
        <WorldGeneratorLayout />
      </div>
    </div>
  );
}
