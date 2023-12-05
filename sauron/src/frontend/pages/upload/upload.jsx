import React, { useRef, useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Yolo from '../../components/modelOptions/yolo.jsx';
import EfficientDetD0 from '../../components/modelOptions/effecientdet_d0.jsx';
import MobileNetSSD from '../../components/modelOptions/mobilenetssd.jsx';
import FasterRCNN from '../../components/modelOptions/faster_rcnn.jsx';

import "./upload.scss"

const ModelType = {
    YOLO: 0,
    MOBILENETSSD: 1,
    FASTERRCNN: 2,
    EFFECIENTDETD0: 3
}

function Upload({ setTab }) {
    const [name, setName] = useState('');
    const [model, setModel] = useState(0);
    const [sourceFileLocation, setSourceFileLocation] = useState('');
    const [sourceFileName, setSourceFileName] = useState('');

    const modelParametersRef = useRef({ "yolo": {}, "mobilenetssd": {}, "faster_rcnn": {}, "efficientdet_d0": {} });

    async function handleFileUpload() {
        const { fpath, fname } = await window.electronAPI.openFile();
        if (fpath && fname) {
            modelParametersRef.current["yolo"]["source"] = fpath;
            modelParametersRef.current["mobilenetssd"]["source"] = fpath;
            modelParametersRef.current["faster_rcnn"]["source"] = fpath;
            modelParametersRef.current["efficientdet_d0"]["source"] = fpath;
            setSourceFileLocation(fpath);
            setSourceFileName(fname);
        }
    }

    function removeFileUpload() {
        setSourceFileLocation('');
        setSourceFileName('');
    }

    function handleNameChange(event) {
        modelParametersRef.current["yolo"]["name"] = event.target.value;
        modelParametersRef.current["mobilenetssd"]["name"] = event.target.value;
        modelParametersRef.current["faster_rcnn"]["name"] = event.target.value;
        modelParametersRef.current["efficientdet_d0"]["name"] = event.target.value;
        setName(event.target.value);
    }

    function selectModel(event) {
        setModel(Number(event.target.value));
    }

    async function handleCreateTask() {
        let models = []

        switch (model) {
            case ModelType.YOLO:
                models = ["yolo"];
                break;
            case ModelType.MOBILENETSSD:
                models = ["mobilenetssd"];
                break;
            case ModelType.FASTERRCNN:
                models = ["faster_rcnn"];
                break;
            case ModelType.EFFECIENTDETD0:
                models = ["efficientdet_d0"];
                break;
        }

        const task = {}

        task["source_file_location"] = sourceFileLocation;
        task["source_file_name"] = sourceFileName;
        task["create_date"] = (new Date()).toUTCString();
        task["models"] = models;
        task["status"] = "unprocessed";
        task["model_params"] = modelParametersRef.current;

        await window.electronAPI.saveTask(task);
        setTab('home');
    }

    function canCreateTask() {
        return name != '' && sourceFileName != '' && sourceFileLocation != '';
    }

    return (
        <div className='uploadContainer'>
            <span className="uploadTitle">Upload Task</span>

            <div className='uploadFormContainer'>
                <div className='informationContainer'>
                    <div className='uploadForm'>
                        <div className='fileContainer'>
                            <button className='upload' onClick={handleFileUpload}>
                                <CloudUploadIcon/>
                                <span>Upload Video</span>
                            </button>

                            { sourceFileName && 
                            <div className='filenameContainer'>
                                <span className='filename'>{sourceFileName}</span>
                                <button className='removeFile' onClick={removeFileUpload}>Remove</button>
                            </div>
                            }
                        </div>

                        <hr/>

                        <div className='nameContainer'>
                            <span className='title'>Task Name</span>
                            <input type='text' onInput={handleNameChange}/>
                        </div>

                        <hr/>
                        
                        <div className='modelContainer'>

                            <div className='section'>
                                <span className='title'>Model</span>
                                <div className='models' defaultValue={ModelType.YOLO} onChange={selectModel}>
                                    <label className='model'>
                                        <input type="radio" value={ModelType.YOLO} defaultChecked name="model" />   
                                        <span>Yolo</span>
                                    </label>
                                    <label className='model'>
                                        <input type="radio" value={ModelType.MOBILENETSSD} name="model" />   
                                        <span>MobileNetSSD</span>
                                    </label>
                                    <label className='model'>
                                        <input type="radio" value={ModelType.FASTERRCNN} name="model" />   
                                        <span>FasterRCNN</span>
                                    </label>
                                    <label className='model'>
                                        <input type="radio" value={ModelType.EFFECIENTDETD0} name="model" />   
                                        <span>EffecientDetD0</span>
                                    </label>
                                </div>
                            </div>

                        
                            <div className='section'>
                                <span className='title'>Options</span>
                                { model == ModelType.YOLO           && <Yolo modelParametersRef={modelParametersRef} /> }
                                { model == ModelType.MOBILENETSSD   && <MobileNetSSD modelParametersRef={modelParametersRef} /> }
                                { model == ModelType.FASTERRCNN     && <FasterRCNN modelParametersRef={modelParametersRef} /> }
                                { model == ModelType.EFFECIENTDETD0 && <EfficientDetD0 modelParametersRef={modelParametersRef} /> }
                            </div>
                        </div>   
                    </div>

                    { canCreateTask()
                    ? <button className="create" onClick={handleCreateTask}>Create Task</button>
                    : <span className="create disabled">Create Task</span>
                    }
                
                </div>

            </div>
        </div>
    )
}

export default Upload