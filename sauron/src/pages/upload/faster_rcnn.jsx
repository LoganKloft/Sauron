import React, { useEffect, useState } from 'react'
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

function FasterRCNN({ modelParametersRef }) {
    const DefaultConfidence = 70;
    const DefaultStride = 10;

    const [confidence, setConfidence] = useState(DefaultConfidence);
    const [stride, setStride] = useState(DefaultStride);

    useEffect(() => {
        modelParametersRef.current["faster_rcnn"]["conf"] = DefaultConfidence;
        modelParametersRef.current["faster_rcnn"]["vid_stride"] = DefaultStride;
    }, [])

    function handleSliderChange(event, newValue) {
        modelParametersRef.current["faster_rcnn"]["conf"] = newValue / 100;
        setConfidence(newValue);
    }

    function handleStrideChange(event) {
        modelParametersRef.current["faster_rcnn"]["vid_stride"] = event.target.value;
        setStride(Number(event.target.value));
    }
    return (
        <div>
            <Typography gutterBottom>
                Faster RCNN Model Parameters
            </Typography>
            <Typography gutterBottom>
                Confidence
            </Typography>
            <Box sx={{ width: 300 }}>
                <Slider defaultValue={DefaultConfidence} aria-label="Default" valueLabelDisplay="auto" onChange={handleSliderChange} />
            </Box>
            <Box sx={{ minWidth: 120, maxWidth: 180 }}>
                <TextField defaultValue={DefaultStride} label="Stride" variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={handleStrideChange} />
            </Box>
        </div>
    )
}

export default FasterRCNN