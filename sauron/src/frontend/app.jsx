import * as React from 'react';

import Toolbar from './components/toolbar/toolbar.jsx'
import Home from './pages/home/home.jsx'
import Upload from './pages/upload/upload.jsx'
import Query from './pages/query/query.jsx'

import "./app.scss"

const App = () => {
    const [tab, setTab] = React.useState("home");
  
    return (
      <div className="app">
        <Toolbar tab={tab} setTab={setTab}/>
        <div id="content">
          {tab == 'home' && <Home setTab={setTab}/>}
          {tab == 'upload' && <Upload setTab={setTab}/>}
          {tab == 'query' && <Query setTab={setTab}/>}
        </div>
      </div>
    );
  }
  
  export default App;