export interface Board {
  board_id: number;
  title: string;
  description: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBoardData {
  title: string;
  description: string;
}
