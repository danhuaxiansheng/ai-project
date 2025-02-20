import { Story } from "@/types/story";
import { database } from "@/services/db";

export interface ExportOptions {
  format: 'markdown' | 'pdf' | 'epub' | 'docx';
  includeMetadata: boolean;
  includePlanning: boolean;
  includeReviews: boolean;
}

export async function exportStory(storyId: string, options: ExportOptions): Promise<Blob> {
  const story = await database.getStoryById(storyId);
  if (!story) throw new Error('Story not found');

  switch (options.format) {
    case 'markdown':
      return await exportMarkdown(story, options);
    case 'pdf':
      return await exportPDF(story, options);
    case 'epub':
      return await exportEPUB(story, options);
    case 'docx':
      return await exportDOCX(story, options);
    default:
      throw new Error('Unsupported format');
  }
}

async function exportMarkdown(story: Story, options: ExportOptions): Promise<Blob> {
  let content = `# ${story.title}\n\n`;
  
  if (options.includeMetadata) {
    content += `> 创建时间：${new Date(story.createdAt).toLocaleDateString()}\n`;
    content += `> 最后更新：${new Date(story.updatedAt).toLocaleDateString()}\n\n`;
  }
  
  content += story.content;
  
  return new Blob([content], { type: 'text/markdown' });
}

async function exportPDF(story: Story, options: ExportOptions): Promise<Blob> {
  // 使用 jsPDF 或其他 PDF 生成库
  throw new Error('PDF export not implemented yet');
}

async function exportEPUB(story: Story, options: ExportOptions): Promise<Blob> {
  // 使用 epub-gen 或其他 EPUB 生成库
  throw new Error('EPUB export not implemented yet');
}

async function exportDOCX(story: Story, options: ExportOptions): Promise<Blob> {
  // 使用 docx 库生成 Word 文档
  throw new Error('DOCX export not implemented yet');
}

// 辅助函数
function formatMetadata(story: Story): string {
  return `
创建时间：${new Date(story.createdAt).toLocaleDateString()}
最后更新：${new Date(story.updatedAt).toLocaleDateString()}
状态：${getStatusText(story.status)}
进度：${story.progress}%
标签：${story.tags.join(', ')}
`;
}

function getStatusText(status: Story['status']): string {
  const statusMap = {
    ongoing: '进行中',
    completed: '已完成',
    draft: '草稿'
  };
  return statusMap[status];
} 