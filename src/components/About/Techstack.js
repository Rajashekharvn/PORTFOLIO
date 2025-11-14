import React from "react";
import { FaAws, FaCode } from "react-icons/fa";
import { DiJavascript1, DiPython, DiGit } from "react-icons/di";
import { SiHtml5, SiCss3 } from "react-icons/si";

function Techstack() {
  const items = [
    { Icon: DiJavascript1, name: "JavaScript" },
    { Icon: SiHtml5, name: "HTML5" },
    { Icon: SiCss3, name: "CSS3" },
    { Icon: DiPython, name: "Python" },
    { Icon: FaCode, name: "DSA" },
    { Icon: DiGit, name: "Git" },
    { Icon: FaAws, name: "AWS" },
  ];

  return (
    <>
      {items.map(({ Icon, name }) => (
        <div key={name} className="tech-icons" data-name={name}>
          <Icon />
        </div>
      ))}
    </>
  );
}

export default Techstack;
