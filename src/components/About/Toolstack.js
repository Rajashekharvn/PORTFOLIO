import React from "react";
import {
  SiVisualstudiocode,
  SiVercel,
  SiWindows,
  SiNetlify,
} from "react-icons/si";

function Toolstack() {
  const items = [
    { Icon: SiWindows, name: "Windows" },
    { Icon: SiVisualstudiocode, name: "VS Code" },
    { Icon: SiVercel, name: "Vercel" },
    { Icon: SiNetlify, name: "Netlify" },
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

export default Toolstack;
