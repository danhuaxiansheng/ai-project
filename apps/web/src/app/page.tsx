import ChatContainer from "@/components/chat/ChatContainer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-8 text-center">AI 小说创作系统</h1>
        <ChatContainer />
      </div>
    </main>
  )
} 