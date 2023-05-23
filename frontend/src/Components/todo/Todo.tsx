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

import "rsuite/dist/rsuite.css";

function Todo() {
  const [searchStr, setSearchStr] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('');
  const { ref, isComponentVisible } = useComponentVisible(false);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // setSearching(searchStr)
    // if (searchStr){
    //     const response = await searchArticles({category,searchStr: searchStr})
    //     if (response.success) {
    //         setArticles(response.articlesInform)
    //         setNotfind(false)
    //     }else {
    //         setLoading(false)
    //     }
    // }
  };

  const handleClick = () => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handleClearClick = () => {
    setSearchStr('');
  };

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
                  placeholder="Search"
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
            format="MM-dd-yyyy"
          />
        </>
        <TodoList />
      </Paper>
    </div>
  );
}

export default Todo;
