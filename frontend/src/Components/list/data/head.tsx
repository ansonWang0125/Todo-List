interface Data {
  taskID: number;
  task: string;
  creator: string;
  createTime: Date;
  dueTime: Date;
  state: string;
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
  }
  
export const headCells: readonly HeadCell[] = [
    // {
    //   id: 'taskID',
    //   numeric: false,
    //   disablePadding: true,
    //   label: 'TaskID',
    // },
    {
      id: 'task',
      numeric: false,
      disablePadding: true,
      label: 'Task',
    },
    // {
    //   id: 'state',
    //   numeric: false,
    //   disablePadding: true,
    //   label: 'State',
    // },
    {
      id: 'creator',
      numeric: false,
      disablePadding: false,
      label: 'Creator',
    },
    {
      id: 'dueTime',
      numeric: true,
      disablePadding: false,
      label: 'Due Time',
    },
    {
      id: 'createTime',
      numeric: true,
      disablePadding: false,
      label: 'Create Time',
    },
  ];