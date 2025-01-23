import { WorldGeneratorForm } from "@/components/world/WorldGeneratorForm";

export default function CreateWorldPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">创建新世界</h1>
      <WorldGeneratorForm />
    </div>
  );
}
