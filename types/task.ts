export type Task = {
  task_id: number;
  name: string;
  position: number;
  due_date: string;
  start_date: string;
  column_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type CreateTask = {
  name: string;
  due_date: string;
  start_date: string;
  column_id: number;
};
