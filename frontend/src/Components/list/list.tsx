import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from './tabelHead/EnhancedTableHead';
import EnhancedTableToolbar from './toolBar/EnhancedToolBar';
// import { todo, done } from './data/rows';
import { stableSort, getComparator } from './sortFunction/sortFunction';
// import EditRoundedIcon from '@mui/icons-material/EditRounded';
// import IconButton from '@mui/material/IconButton';
import { useUserContext } from '../../Context/UserCtx';
import { useStateContext } from '../../Context/StateCtx';
import MyDrawer from './drawer/drawer';
import { io } from "socket.io-client";
import { useTaskContext } from '../../Context/TaskCtx';

const socket: any = io('http://localhost:8080'); //'http://localhost:8080'

type Order = 'asc' | 'desc';

interface Data {
  taskID: number;
  task: string;
  creator: string;
  createTime: Date;
  dueTime: Date;
  state: string;
}

export default function TodoList() {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('creator');
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const {state} = useStateContext();
  const {todo, done} = useTaskContext()
  const rows = state === 'todo'? todo : done;
  const initialState = rows.length === 0 ? null : rows[0]
  const [currRow, setCurrRow] = useState(initialState);
  console.log(currRow)
  const [open, setOpen] = useState(false);
  const {user} = useUserContext();

  useEffect(() => {
    const chatroomUser = (data: any) => {
      console.log(data);
    }
    socket.on('comment_users', chatroomUser);

    return () => socket.off('comment_users');
  });

  const toggleDrawer =
    (open: boolean, row: Data|null) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      // console.log("wtf?")
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      // console.log('before drawer: ', open)
      if (open) {
        console.log('join')
        socket.emit('join_comment', {username: user, taskID: row?.taskID.toString()});
      } else {
        // const createdtime = Date.now();
        console.log('leave')
        socket.emit('get_room_members', {taskID: row?.taskID.toString()})
        socket.emit('leave_comment', { username: user, taskID: row?.taskID.toString()});
        socket.emit('get_room_members', {taskID: row?.taskID.toString()})
        // socket.disconnect();
      }
      // socket.emit('join_comment', { user: 'John', name: 'example' });
      // socket.emit("join_comment", '', '')
      setOpen(open);
    };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.taskID);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    event.preventDefault();
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    console.log("date", date)
  
    return date.toLocaleString('zh-TW', options).slice(0, 10);
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <MyDrawer toggleDrawer={toggleDrawer} open={open} row={currRow} socket={socket}/>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} socket={socket} row={currRow}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.taskID);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={e => {setCurrRow(row);toggleDrawer(true, row)(e)}} //setCurrRow(row);toggleDrawer(true);
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.taskID}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onClick={(event) => {handleClick(event, row.taskID); event.stopPropagation();}}
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.task}
                    </TableCell>
                    <TableCell align="right">{row.creator}</TableCell>
                    <TableCell align="right">{formatDate(row.dueTime)}</TableCell>
                    <TableCell align="right">{formatDate(row.createTime)}</TableCell>
                    {/* <TableCell padding="none">
                      <IconButton onClick={()=>handleEdit(row)}>
                        <EditRoundedIcon
                          color="primary"
                        />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[7]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}