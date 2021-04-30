import React from 'react';
import "../sass/general.scss";
import { Unigrid } from "../unigrid";
import { UnigridExamples } from "../examples/UnigridExamples"





function General() {
    return (
        <div>
            <div className="container">Hello React</div>
            <Unigrid />
            <UnigridExamples />
        </div>

    )
}

export default General
