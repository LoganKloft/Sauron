import React, { useEffect, useState } from 'react'
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

function Yolo({ modelParametersRef }) {
    const weightOptions = ["YOLOv8n", "YOLOv8s", "YOLOv8m", "YOLOv8l", "YOLOv8x"];

    const DefaultConfidence = 70;
    const DefaultStream = true;
    const DefaultSave = true;
    const DefaultWeight = "YOLOv8n";
    const DefaultStride = 10;
    const DefaultProject = "./src/data/video";

    const [confidence, setConfidence] = useState(DefaultConfidence);
    const [stream, setStream] = useState(DefaultStream);
    const [save, setSave] = useState(DefaultSave);
    const [weight, setWeight] = useState(DefaultWeight);
    const [stride, setStride] = useState(DefaultStride);

    useEffect(() => {
        modelParametersRef.current["yolo"]["conf"] = DefaultConfidence;
        modelParametersRef.current["yolo"]["stream"] = DefaultStream;
        modelParametersRef.current["yolo"]["save"] = DefaultSave;
        modelParametersRef.current["yolo"]["weights"] = DefaultWeight;
        modelParametersRef.current["yolo"]["vid_stride"] = DefaultStride;
        modelParametersRef.current["yolo"]["project"] = DefaultProject;

    }, [])

    function handleSliderChange(event, newValue) {
        modelParametersRef.current["yolo"]["conf"] = newValue / 100;
        setConfidence(newValue);
    }

    function handleStreamChange() {
        modelParametersRef.current["yolo"]["stream"] = !stream;
        setStream((prev) => !prev)
    }

    function handleSaveChange() {
        modelParametersRef.current["yolo"]["save"] = !save;
        setSave((prev) => !prev)
    }

    function handleWeightChange(event) {
        modelParametersRef.current["yolo"]["weights"] = event.target.value;
        setWeight(event.target.value);
    }

    function handleStrideChange(event) {
        modelParametersRef.current["yolo"]["vid_stride"] = event.target.value;
        setStride(Number(event.target.value));
    }

    return (
        <div>
            <Typography gutterBottom>
                Yolo Model Parameters
            </Typography>
            <Typography gutterBottom>
                Confidence
            </Typography>
            <Box sx={{ width: 300 }}>
                <Slider defaultValue={DefaultConfidence} aria-label="Default" valueLabelDisplay="auto" onChange={handleSliderChange} />
            </Box>
            <FormGroup>
                <FormControlLabel control={<Checkbox defaultChecked onClick={() => handleStreamChange} />} label="Stream" />
                <FormControlLabel control={<Checkbox defaultChecked onClick={() => handleSaveChange} />} label="Save" />
            </FormGroup>
            <Box sx={{ minWidth: 120, maxWidth: 180 }}>
                <FormControl fullWidth>
                    <InputLabel id="weight-select-label">Weight</InputLabel>
                    <Select
                        labelId="weight-select-label"
                        value={weight}
                        label="Weight"
                        onChange={handleWeightChange}
                    >
                        {
                            weightOptions.map(weightOption => {
                                return (<MenuItem key={weightOption} value={weightOption}>{weightOption}</MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
                <TextField defaultValue={DefaultStride} label="Stride" variant="standard" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} onChange={handleStrideChange} />
            </Box>
        </div >
    )
}

export default Yolo