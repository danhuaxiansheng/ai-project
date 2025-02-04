import { useEffect, useState } from "react";
import { monitorService } from "@/lib/services/monitorService";
import { MonitorState, MonitorUpdate } from "@/types/monitor";

export function useGlobalMonitor() {
  const [state, setState] = useState<MonitorState>(monitorService.getState());

  useEffect(() => {
    const unsubscribe = monitorService.subscribe((update: MonitorUpdate) => {
      setState(monitorService.getState());
    });

    return () => unsubscribe();
  }, []);

  return state;
}
