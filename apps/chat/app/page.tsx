import { CommandPanel } from "@/components/intervention/CommandPanel";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-6">
        <CommandPanel />
      </main>
    </div>
  );
}
