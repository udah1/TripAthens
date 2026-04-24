import { getRedis, checkPassword } from "@/lib/expenses";

export { getRedis, checkPassword };

export interface TaskState {
  id: string; // hash של טקסט המשימה
  done: boolean;
  doneBy?: string; // שם מי שסימן
  doneAt?: number; // epoch ms
}

export const TASK_STATE_KEY = "athens:task-state:v1";

// מזהה עקבי על בסיס טקסט המשימה (djb2)
export function taskIdFromText(text: string): string {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return `t_${(hash >>> 0).toString(36)}`;
}
