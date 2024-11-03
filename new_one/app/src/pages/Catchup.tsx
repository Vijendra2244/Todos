import { window_send_message } from '@/store'
import { Box } from '@mui/material';
import { useEffect } from 'react'

const Catchup = () => {
    useEffect(()=>{
        // console.log("message sent from catchup.tsx");
        window_send_message("parent", "handle_catchup_page_iframe_ready");
    },[])
    
  return (
    <Box className="analytic-page">
      <h2>Catchup Page</h2>
    </Box>
  )
}

export default Catchup