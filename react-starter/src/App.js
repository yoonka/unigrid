import React from "react";
import "../sass/App.scss"
import { Unigrid } from "../unigrid"
import { UnigridExamples } from '../examples/UnigridExamples';

function App() {
    return (
        <div>
            <div className="container">Hello React</div>
            <Unigrid />
            <UnigridExamples />
        </div>
    )
}

export default App