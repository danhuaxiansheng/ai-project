export class ErrorHandler {
  private retryCount = 0;
  private maxRetries = 3;
  private backoffTime = 1000; // 初始延迟 1 秒

  async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (this.retryCount < this.maxRetries && this.isRetryableError(error)) {
        this.retryCount++;
        await this.delay(this.backoffTime * this.retryCount);
        return this.withRetry(operation);
      }
      throw this.handleError(error);
    } finally {
      this.retryCount = 0; // 重置重试计数
    }
  }

  private isRetryableError(error: any): boolean {
    return [429, 503, 504].includes(error.status);
  }

  private handleError(error: any): Error {
    const status = error.status || 500;
    const message = error.message || "未知错误";

    switch (status) {
      case 400:
        return new Error("请求格式错误，请检查输入");
      case 401:
        return new Error("API 密钥无效或已过期，请更新配置");
      case 403:
        return new Error("没有访问权限，请检查 API 密钥权限");
      case 429:
        return new Error("API 调用频率超限，请稍后重试");
      case 503:
      case 504:
        return new Error("服务暂时不可用，请稍后重试");
      default:
        return new Error(`请求失败: ${message}`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const errorHandler = new ErrorHandler();
