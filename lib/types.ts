export interface User {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

export interface TaskList {
  id: string;
  title: string;
  description: string;
  taskCount: number;
  createdAt: Date;
}
