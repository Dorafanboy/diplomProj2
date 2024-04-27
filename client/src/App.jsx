import React from 'react';
import "./styles/app.scss"
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/Canvas";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path='/:id' element={
                        <>
                            <Toolbar/>
                            <SettingBar/>
                            <Canvas/>
                        </>
                    }/>
                    <Route path='*' element={<Navigate to={`f${(+new Date).toString(16)}`} replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
