interface Data {
    name: string,
    creator: string,
    dueTime: Date,
    createTime: Date,
}

interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
  }
  
export const headCells: readonly HeadCell[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'TaskName',
    },
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