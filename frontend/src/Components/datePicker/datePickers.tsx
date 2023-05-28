import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function DatePickers() {
    const today = new Date();
    return (
        <DemoContainer
            components={[
            'DatePicker',
            ]}
        >
            <DemoItem label="Due Time">
                <DesktopDatePicker defaultValue={dayjs(today.toString())} disablePast />
            </DemoItem>
        </DemoContainer>
    );
}