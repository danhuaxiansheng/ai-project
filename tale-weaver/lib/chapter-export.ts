import { Chapter } from "@/types/story";

export async function exportChapter(chapter: Chapter, format: 'txt' | 'md' = 'txt'): Promise<Blob> {
  let content = '';
  
  if (format === 'md') {
    content = `# ${chapter.title}\n\n${chapter.content}`;
  } else {
    content = `${chapter.title}\n\n${chapter.content}`;
  }

  return new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
}

export async function exportChapters(chapters: Chapter[], format: 'txt' | 'md' = 'txt'): Promise<Blob> {
  const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);
  let content = '';
  
  if (format === 'md') {
    content = sortedChapters
      .map(chapter => `# ${chapter.title}\n\n${chapter.content}`)
      .join('\n\n---\n\n');
  } else {
    content = sortedChapters
      .map(chapter => `${chapter.title}\n\n${chapter.content}`)
      .join('\n\n==========\n\n');
  }

  return new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
} 