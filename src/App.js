import React from "react";
import "../sass/App.scss";
import { Unigrid } from "../unigrid"
import { UnigridExamples } from '../examples/UnigridExamples';

function App() {
    return (
        <div className="examples-container">
            <div className="examples-container-box">
                <h1 className="examples-tittle">Unigrid Examples</h1>
                <Unigrid />
                <UnigridExamples />
            </div>
        </div >
    )
}

export default App