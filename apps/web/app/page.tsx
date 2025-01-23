import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, History, Mountain, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center bg-gradient-to-b from-background to-muted">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          创造你的 <span className="text-primary">虚拟世界</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          通过先进的 AI
          技术，生成完整的世界设定，包括地理环境、文明发展、历史事件等
        </p>
        <div className="flex gap-4">
          <Link href="/world/create">
            <Button size="lg">
              开始创造
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">主要功能</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Globe className="w-10 h-10" />}
              title="世界生成"
              description="基于您的需求，生成完整的世界设定"
            />
            <FeatureCard
              icon={<Mountain className="w-10 h-10" />}
              title="地理环境"
              description="自动创建地形、气候和资源分布"
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="文明发展"
              description="模拟社会结构和文化演变"
            />
            <FeatureCard
              icon={<History className="w-10 h-10" />}
              title="历史事件"
              description="生成丰富的历史背景和重大事件"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            准备好开始你的世界创造之旅了吗？
          </h2>
          <p className="text-lg mb-8 text-primary-foreground/90">
            只需简单几步，即可生成独特的虚拟世界
          </p>
          <Link href="/world/create">
            <Button size="lg" variant="secondary" className="font-semibold">
              立即开始
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
