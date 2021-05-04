import React from "react";
import "../sass/App.scss"
import { Unigrid } from "../unigrid"
import { UnigridExample1 } from "../examples/UnigridExample1"
// import { UnigridExamples } from "../examples/UnigridExamples"

function App() {
    return (
        <div>
            <div className="container">Hello React</div>
            <Unigrid />
            <UnigridExample1 />
            {/* <UnigridExamples /> */}
        </div>

    )
}

export default App