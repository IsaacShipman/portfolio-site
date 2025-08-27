import Image from "next/image";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// For dynamic image loading
const imagePath = '/pdf.png'

export default function Pdf({name}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 75 }}>
      <Image 
        src={imagePath} 
        alt="PDF icon" 
        width={75} 
        height={75} 
        style={{ objectFit: 'cover' }}
      />
      <Typography 
        variant="h1" 
        sx={{ 
          color: 'white', 
          fontSize: 10, 
          fontWeight: 'bold',
          marginTop: '-10px',
          fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif'
        }}
      >
        {name}
      </Typography>
    </Box>
  )
}


