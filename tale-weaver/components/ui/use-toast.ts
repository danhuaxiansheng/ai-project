"use client";

import * as React from "react";
import {
  type ToastActionElement,
  type ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type State = {
  toasts: ToasterToast[];
};

// 创建一个全局状态管理器
class ToastManager {
  private static instance: ToastManager;
  private listeners: Array<(state: State) => void> = [];
  private state: State = { toasts: [] };
  private count = 0;

  private constructor() {}

  static getInstance() {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: State) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private genId() {
    this.count = (this.count + 1) % Number.MAX_VALUE;
    return this.count.toString();
  }

  toast(props: Omit<ToasterToast, "id">) {
    const id = this.genId();

    const update = (props: ToasterToast) => {
      this.state = {
        ...this.state,
        toasts: this.state.toasts.map(t =>
          t.id === id ? { ...t, ...props } : t
        ),
      };
      this.notify();
    };

    const dismiss = () => {
      this.state = {
        ...this.state,
        toasts: this.state.toasts.map(t =>
          t.id === id ? { ...t, open: false } : t
        ),
      };
      this.notify();
      
      // 自动移除
      setTimeout(() => {
        this.state = {
          ...this.state,
          toasts: this.state.toasts.filter(t => t.id !== id),
        };
        this.notify();
      }, TOAST_REMOVE_DELAY);
    };

    this.state = {
      ...this.state,
      toasts: [
        {
          ...props,
          id,
          open: true,
          onOpenChange: (open: boolean) => {
            if (!open) dismiss();
          },
        },
        ...this.state.toasts,
      ].slice(0, TOAST_LIMIT),
    };
    this.notify();

    return {
      id,
      dismiss,
      update,
    };
  }

  getState() {
    return this.state;
  }
}

// 创建全局单例
const toastManager = ToastManager.getInstance();

// 导出全局 toast 函数
export const toast = toastManager.toast.bind(toastManager);

// 导出 hook 用于获取 toast 状态
export function useToast() {
  const [state, setState] = React.useState<State>(toastManager.getState());

  React.useEffect(() => {
    return toastManager.subscribe(setState);
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        const toast = state.toasts.find(t => t.id === toastId);
        if (toast?.onOpenChange) {
          toast.onOpenChange(false);
        }
      } else {
        state.toasts.forEach(toast => {
          if (toast.onOpenChange) {
            toast.onOpenChange(false);
          }
        });
      }
    },
  };
}
