import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import './css/drawer.css'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import Messages from '../../comment/comment';
import SendMessage from '../../comment/addComment';
import { useLoginContext } from '../../../Context/LoginCtx';
import { apiUpdateTask } from '../../../axios/api';
import Button from '@mui/material/Button';
import { useTaskContext } from '../../../Context/TaskCtx';

interface Data {
    taskID: number;
    task: string;
    creator: string;
    createTime: Date;
    dueTime: Date;
    state: string;
  }

interface MyDrawerProps {
    toggleDrawer: (open: boolean, row: Data|null) => (event: React.KeyboardEvent | React.MouseEvent) => void;
    open: boolean;
    row: Data|null;
    socket: any;
}

interface Update {
    task: string;
    dueTime: string;
    taskID: number;
}

export default function MyDrawer(props: MyDrawerProps){
  const anchor = 'left';
  const { login } = useLoginContext();
  const [dueTime, setDueTime] = useState(formatDate(props.row?.dueTime))
  const initialState = props.row !== null ? props.row.task : ''
  const [task, setTask] = useState(initialState);
  const {fetch, changeFetch} = useTaskContext();
  function formatDate(date: Date|undefined): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
  
    return date !== undefined ? date.toLocaleString('zh-TW', options).slice(0, 10) : '';
  }
  async function UpdateTask(credentials: Update) {
    try {
      const response = await apiUpdateTask(credentials);
      if (response.status === 200) {
        const responseData = response.data;
        // console.log('success');
        // console.log('response = ', responseData);
        return responseData;
      }
    } catch (reason: any){ 
        let response = reason.response
        console.log(response)
    }
}

    const handleDueTimeChange = (value: Dayjs|null) => {
    if ( value !== null){
    //   console.log(dueTime)
      setDueTime(value.format("YYYY-MM-DD").toLocaleString())
    //   console.log(value.format("YYYY-MM-DD").toLocaleString())
    }
  }

  const handleSubmit = async () => {
    // console.log(task)
    // console.log(props.row?.taskID)
    if ( task !== undefined && props.row?.taskID !== undefined){
        // console.log("submit")
        const response = await UpdateTask({task, dueTime, taskID: props.row?.taskID});
        console.log(response)
        changeFetch(!fetch)
    }
  }

  const list = (socket: any) => (
    <Box
      sx={{ width: "100%" }}
      role="presentation"
      id="drawerBox"
    >
        <div id="field">
            <div className='drawerRow'>
                <Typography variant="subtitle1" gutterBottom className="drawerField">
                    Task Name:
                </Typography>
                <TextField className="drawerInput" variant="outlined" defaultValue={props.row?.task} disabled={!login} onChange={(event) => setTask(event.target.value)}/>
            </div>
            <div className='drawerRow'>
                <Typography variant="subtitle1" gutterBottom className="drawerField">
                    Due Time:
                </Typography>
                <DesktopDatePicker className="drawerInput" defaultValue={dayjs(props.row?.dueTime.toLocaleString())} disablePast readOnly={!login} onChange={handleDueTimeChange}/>
            </div>
            <div className='drawerRow'>
                <Typography variant="subtitle1" gutterBottom className="drawerField">
                    Create Time:
                </Typography>
                <DesktopDatePicker className="drawerInput" readOnly defaultValue={dayjs(props.row?.createTime.toLocaleString())} />
            </div>
            <Button variant="outlined" sx={{width: "50%", margin: 'auto', marginTop: '15px'}} onClick={handleSubmit}>Save</Button>
            <h5>Comment</h5>
            <Messages socket={socket}/>
            <SendMessage socket={socket} id={props.row?.taskID}/>
        </div>
    </Box>
  );

  return (
    <div>
        <Drawer
            PaperProps={{
                sx: { width: "30%" },
            }}
            anchor={anchor}
            open={props.open}
            onClose={props.toggleDrawer(false, props.row)}
        >
            {list(props.socket)}
        </Drawer>
    </div>
  );
}