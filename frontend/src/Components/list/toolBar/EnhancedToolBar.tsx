import React, { useState, Dispatch, SetStateAction } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MyModal from '../modal/modal';
import { useStateContext } from '../../../Context/StateCtx';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import { useLoginContext } from '../../../Context/LoginCtx';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import { apiCompleteTask, apiDeleteTask } from '../../../axios/api';
import { useTaskContext } from '../../../Context/TaskCtx';
import { useUserContext } from '../../../Context/UserCtx';

interface Data {
  taskID: number;
  task: string;
  creator: string;
  createTime: Date;
  dueTime: Date;
  state: string;
}

interface EnhancedTableToolbarProps {
    numSelected: number;
    selected: readonly number [];
    setSelected: Dispatch<SetStateAction<readonly number[]>>;
    socket: any;
    row: Data|null;
  }

interface CompleteTask {
    taskIDs: readonly number [];
}

interface DeleteTask {
  taskIDs: readonly number [];
}
  
export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const {state, changeState} = useStateContext();
    const {login} = useLoginContext();
    const {fetch, changeFetch} = useTaskContext();
    const {user} = useUserContext();

    async function CompleteTask(credentials: CompleteTask) {
      try {
        const response = await apiCompleteTask(credentials);
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

  async function DeleteTask(credentials: DeleteTask) {
    try {
      const response = await apiDeleteTask(credentials);
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

  const handleComplete = async () => {
    console.log(props.selected)
      const response = await CompleteTask({taskIDs: props.selected});
      console.log(response)
      changeFetch(!fetch)
      props.setSelected([])
      props.socket.emit('complete_task', {
        username: user,
        taskID: props.row?.taskID.toString(),
      });
  };

  const handleDelete = async () => {
    console.log(props.selected)
      const response = await DeleteTask({taskIDs: props.selected});
      console.log(response)
      changeFetch(!fetch)
      props.setSelected([])
      window.location.reload();
  };

    const handleChangeDone = () => {
      changeState('done');
    }

    const handleChangeTodo = () => {
      changeState('todo');
    }
  
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            {state === "todo" ? "To do": "Done"}
          </Typography>
        )}
        {numSelected > 0 ? (
          state === "done" ? (
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Complete">
              <IconButton onClick={handleComplete}>
                <DoneRoundedIcon />
              </IconButton>
            </Tooltip>
          )
        ) : (
          <>
            {login ? (
              <>
                <MyModal handleOpen={handleOpen} handleClose={handleClose} open={open} />
                <Tooltip title="Add">
                  <IconButton onClick={handleOpen}>
                    <AddRoundedIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <></>
            )}
            {state === 'todo' ? (
              <Tooltip title="Done">
                <IconButton onClick={handleChangeDone}>
                  <CheckCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Todo">
                <IconButton onClick={handleChangeTodo}>
                  <LocalFireDepartmentRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
          </>
        )}

      </Toolbar>
    );
  }