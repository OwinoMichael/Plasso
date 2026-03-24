export interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  status: string;
  time: number;
  memory: number;
}