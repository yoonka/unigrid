import React from 'react';
import "../sass/general.scss";
import { UnigridExample14 } from "../examples/UnigridExample14"
import { UnigridExamples } from '../examples/UnigridExamples';



function General() {
    return (
        <div>
            <div className="container">Hello React</div>
            <UnigridExample14 />
            <UnigridExamples />
        </div>

    )
}

export default General
