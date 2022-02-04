import React from "react";
import "../sass/app.scss";
import { Unigrid } from "../unigrid"
import { UnigridExamples } from '../examples/unigridExamples';

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