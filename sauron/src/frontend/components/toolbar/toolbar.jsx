import './toolbar.scss'

import * as React from 'react';
import Logo from '../../../assets/icons/ring_white.png'
import MinimizeImg from '../../../assets/app/minimize.png'
import MaximizedImg from '../../../assets/app/maximized.png'
import UnmaximizedImg from '../../../assets/app/unmaximized.png'
import ShowDevImg from '../../../assets/app/showing_dev_tools.png'
import NotShowDevImg from '../../../assets/app/not_showing_dev_tools.png'
import CloseImg from '../../../assets/app/close.png'

export default ({tab, setTab}) => {
    const [maximized, setMaximized] = React.useState(false);
    const [showingDevTools, setShowingDevTools] = React.useState(false);

    React.useEffect(() => {
        // Get the initial state
        (async () => {
            setMaximized(await window.electronAPI.isMaximized());
            setShowingDevTools(await window.electronAPI.isDevToolsOpened());
        })();

        // Add listeners to update the state
        window.electronListeners["window:maximize"].on("toolbar", () => { setMaximized(true) })
        window.electronListeners["window:unmaximize"].on("toolbar", () => { setMaximized(false) })
        window.electronListeners["window:open_dev_tools"].on("toolbar", () => { setShowingDevTools(true) })
        window.electronListeners["window:close_dev_tools"].on("toolbar", () => { setShowingDevTools(false) })

        return () => {
            // Remove listeners
            window.electronListeners["window:maximize"].remove("toolbar");
            window.electronListeners["window:unmaximize"].remove("toolbar");
            window.electronListeners["window:open_dev_tools"].remove("toolbar");
            window.electronListeners["window:close_dev_tools"].remove("toolbar");
        }
    },[maximized, setMaximized, showingDevTools, setShowingDevTools]);

    const minimize = () => {
        window.electronAPI.minimize();
    }

    const toggleDevTools = () => {
        window.electronAPI.toggleDevTools();
    }

    const toggleMaximized = async () => {
        window.electronAPI.toggleMaximized();
    }

    const close = () => {
        window.electronAPI.close();
    }

    return (
        <div id="toolbar">
            <div id="drag-region">
                <div className="left-container">
                    <img className='logo' draggable="false" src={Logo}/>
                    <div className={tab == 'home'? 'tab selected' : 'tab'} onClick={() => setTab('home')}>
                        <span>Home</span>
                    </div>
                    <div className={tab == 'upload'? 'tab selected' : 'tab'} onClick={() => setTab('upload')}>
                        <span>Upload</span>
                    </div>
                    <div className={tab == 'query'? 'tab selected' : 'tab'} onClick={() => setTab('query')}>
                        <span>Query</span>
                    </div>
                </div>
                <div className="right-container">
                    <div className='control light' onClick={toggleDevTools}>
                        {   showingDevTools 
                        ?  <img draggable="false" src={ShowDevImg}/>
                        :  <img draggable="false" src={NotShowDevImg}/>
                        }
                    </div>
                    <div className='control light' onClick={minimize}>
                        <img draggable="false" src={MinimizeImg}/>
                    </div>
                    <div className='control light' onClick={toggleMaximized}>
                        {   maximized 
                        ?  <img draggable="false" src={MaximizedImg}/>
                        :  <img draggable="false" src={UnmaximizedImg}/>
                        }
                       
                    </div>
                    <div className='control red' onClick={close}>
                        <img draggable="false" src={CloseImg}/>
                    </div>
                </div>
            </div>
        </div>
    )
}