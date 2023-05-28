import React, { useState, useRef } from 'react';
import './css/todo.css';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import useComponentVisible from '../../Hook/useComponentVisible';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import Filter from '../filter/filter';
import { DateRangePicker } from 'rsuite';
import TodoList from '../list/list';
import { apiSearchByCreator, apiSearchByTask, apiSearchByTime } from '../../axios/api';
import { useTaskContext } from '../../Context/TaskCtx';
import "rsuite/dist/rsuite.css";
import { DateRange } from 'rsuite/esm/DateRangePicker';

interface Creator {
  creator: string;
}

interface Task {
  task: string;
}

interface Time {
  start: string;
  end: string;
}

interface Data {
  taskID: number;
  task: string;
  creator: string;
  createTime: Date;
  dueTime: Date;
  state: string;
}

function Todo() {
  const [searchStr, setSearchStr] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('Creator');
  const { ref, isComponentVisible } = useComponentVisible(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const {changeTodo, changeDone} = useTaskContext();

  async function SearchByCreator(credentials: Creator) {
        try {
          const response = await apiSearchByCreator(credentials);
          if (response.status === 200) {
            const responseData = response.data;
            console.log('success');
            console.log('response = ', responseData);
            return responseData;
          }
        } catch (reason: any){ 
            let response = reason.response
            console.log(response)
        }
  }

  async function SearchByTask(credentials: Task) {
    try {
      const response = await apiSearchByTask(credentials);
      if (response.status === 200) {
        const responseData = response.data;
        console.log('success');
        console.log('response = ', responseData);
        return responseData;
      }
    } catch (reason: any){ 
        let response = reason.response
        console.log(response)
    }
}

async function SearchByTime(credentials: Time) {
  try {
    const response = await apiSearchByTime(credentials);
    if (response.status === 200) {
      const responseData = response.data;
      console.log('success');
      console.log('response = ', responseData);
      return responseData;
    }
  } catch (reason: any){ 
      let response = reason.response
      console.log(response)
  }
}

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('what the fuck')
    if ( searchBy === 'Creator'){
      const response = await SearchByCreator({creator: searchStr});
      console.log(response)
      changeTodo(response.filter((row: Data) => row.state === 'todo'))
      changeDone(response.filter((row: Data) => row.state === 'done'))
    } else if ( searchBy === 'Creator' ){
      const response = await SearchByTask({task: searchStr});
      console.log(response)
      changeTodo(response.filter((row: Data) => row.state === 'todo'))
      changeDone(response.filter((row: Data) => row.state === 'done'))
    }
  };

  const handleClick = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handleClearClick = () => {
    setSearchStr('');
  };

  const handleSelect = async () => {
    if (start !== '' && end !== '') {
      const response = await SearchByTime({start, end});
      console.log(response)
      changeTodo(response.filter((row: Data) => row.state === 'todo'))
      changeDone(response.filter((row: Data) => row.state === 'done'))
    }
  }

  const handleOnChange = (value: DateRange|null) => {
    console.log(value)
    if (value !== null ){
      setStart(value[0].toLocaleString())
      setEnd(value[1].toLocaleString())
    }
  }

  return (
    <div className="todo">
      <Paper id="todopaper" elevation={3}>
        <div className="Searchbar">
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              '& > :not(style)': {
                m: 1,
                height: 50,
              },
            }}
            id="box"
            ref={ref}
          >
            <Paper elevation={1} id="searchPaper" onClick={handleClick}>
              <form onSubmit={handleSearch} id="searchForm">
                <input
                  id="searchinput"
                  placeholder={"Search by "+searchBy}
                  value={searchStr}
                  onChange={(e) => setSearchStr(e.target.value)}
                  ref={searchRef}
                />
                {isComponentVisible && searchStr ? (
                  <IconButton onClick={handleClearClick}>
                    <ClearIcon fontSize="large" />
                  </IconButton>
                ) : (
                  <IconButton>
                    <SearchIcon fontSize="large" />
                  </IconButton>
                )}
              </form>
            </Paper>
          </Box>
          <Filter setSearchBy={setSearchBy}/>
        </div>
        <>
          <DateRangePicker 
            placeholder="Select a period"
            format="MM-dd-yyyy"
            onChange={handleOnChange}
            onClose={handleSelect}
          />
        </>
        <TodoList/>
      </Paper>
    </div>
  );
}

export default Todo;
