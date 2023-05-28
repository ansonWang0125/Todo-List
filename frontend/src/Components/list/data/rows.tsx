interface Data {
    id: number,
    name: string,
    creator: string,
    dueTime: Date,
    createTime: Date,
}

function createData(
    id: number,
    name: string,
    creator: string,
    dueTime: Date,
    createTime: Date,
  ): Data {
    return {
      id,
      name,
      creator,
      dueTime,
      createTime,
    };
  }

export const todo = [
    createData(1,'First Task', "Anson",  new Date("2023-05-30"), new Date("2023-06-10")),
    createData(2,'Second Task', "Anson",  new Date("2023-05-20"), new Date("2023-06-01")),
    createData(3,'Third Task', "Anson",  new Date("2023-05-10"), new Date("2023-06-15")),
  ];

  export const done = [
    createData(4,'Forth Task', "Anson",  new Date("2023-05-30"), new Date("2023-06-10")),
    createData(5,'Fifth Task', "Anson",  new Date("2023-05-20"), new Date("2023-06-01")),
    createData(6,'Sixth Task', "Anson",  new Date("2023-05-10"), new Date("2023-06-15")),
  ];