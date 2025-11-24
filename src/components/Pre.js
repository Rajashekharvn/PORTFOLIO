import React from "react";
import Particle from "./Particle";
import "./PreloaderParticles.css";

function Pre(props) {
  return (
    <div id={props.load ? "preloader" : "preloader-none"}>
      {props.load && <Particle id="preloader-particles" />}
    </div>
  );
}

export default Pre;
