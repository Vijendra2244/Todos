import { useState } from 'react';
import { Box, TextField } from '@mui/material';

interface CustomTimeRangePickerProps {
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
}

const CustomTimeRangePicker: React.FC<CustomTimeRangePickerProps> = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  return (
    <>
      <Box sx={{ mt: "10px", mb: "10px", padding: "10px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <TextField
          label="Start Time"
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 minutes
          }}
        />
        <span style={{ marginLeft: "10px", marginRight: "10px" }}>-</span>

        <TextField
          label="End Time"
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 minutes
          }}
        />
      </Box>

    </>
  );
};

export default CustomTimeRangePicker;
