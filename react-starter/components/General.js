import React from 'react';
import "../sass/general.scss";
import { Unigrid } from "../unigrid";
import { UnigridExample14 } from "../examples/UnigridExample14"
// import { UnigridExamples } from '../examples/UnigridExamples';



function General() {
    return (
        <div>
            <div className="container">Hello React</div>
            <Unigrid />
            <UnigridExample14 />
            {/* <UnigridExamples /> */}
        </div>

    )
}

export default General
