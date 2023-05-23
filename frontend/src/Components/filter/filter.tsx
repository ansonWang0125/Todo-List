import React, {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TuneIcon from '@mui/icons-material/Tune';

interface FilterProps {
    setSearchBy: (value: string) => void;
}

const options = [
    "Creater",
    "Task"
  ];

const ITEM_HEIGHT = 48;

export default function Filter({ setSearchBy }: FilterProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    const selectedOption = event.currentTarget.textContent;
    console.log(selectedOption);
    setSearchBy(selectedOption || "");
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="filter-button"
        aria-controls={open ? 'filter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <TuneIcon fontSize="large"/>
      </IconButton>
      <Menu
        id="filter-menu"
        MenuListProps={{
          'aria-labelledby': 'filter-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Creater'} onClick={handleSelect}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}