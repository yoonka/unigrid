import React from "react";
import "../sass/App.scss"
import { Unigrid } from "../unigrid"
import { UnigridExample14 } from "../examples/UnigridExample14"

function App() {
    return (
        <div>
            <div className="container">Hello React</div>
            <Unigrid />
            <UnigridExample14 />
        </div>

    )
}

export default App