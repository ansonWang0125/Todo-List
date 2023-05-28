import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import "./css/modal.css";
import { apiCreateTask } from '../../../axios/api';
import { useTaskContext } from '../../../Context/TaskCtx';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Modalprops {
    handleOpen: () => void;
    handleClose: () => void;
    open: boolean;
}

interface CreateTask {
  task: string;
  createTime: string;
  dueTime: string;
}

export default function MyModal(props: Modalprops){
  const today = new Date();
  console.log(today)
  console.log(today.toISOString().slice(0, 10))
  const [task, setTask] = React.useState('')
  const [dueTime, setDueTime] = React.useState(today.toISOString().slice(0, 10))
  const {fetch, changeFetch} = useTaskContext()

  async function AddTask(credentials: CreateTask) {
    try {
      const response = await apiCreateTask(credentials);
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

  const handleSubmit = async () => {
    const nowTime = new Date()
    const response = await AddTask({task, createTime: nowTime.toISOString().slice(0, 10), dueTime});
    console.log(response)
    changeFetch(!fetch)
    props.handleClose()
  }

  const handleDueTimeChange = (value: Dayjs|null) => {
    if ( value !== null){
      console.log(dueTime)
      setDueTime(value.format("YYYY-MM-DD").toLocaleString())
      console.log(value.format("YYYY-MM-DD").toLocaleString())
    }
  }

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} id="modalBox">
            <Typography id="modal-modal-title" variant="h6" component="h1" className="modalData">
                Add Task
            </Typography>
            <TextField id="taskName" label="Task Name" variant="outlined" className="modalData" onChange={(event) => setTask(event.target.value)} />
            <div className="modalData">
                <DemoContainer
                    components={[
                    'DatePicker',
                    ]}
                >
                    <DemoItem label="Due Time">
                        <DesktopDatePicker defaultValue={dayjs(today.toLocaleString())} disablePast onChange={handleDueTimeChange}/>
                    </DemoItem>
              </DemoContainer>
            </div>
            <Button variant="outlined" id="dataConfirm" onClick={handleSubmit}>Ok</Button>
        </Box>
      </Modal>
    </div>
  );
}