import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiVercel,
  SiWindows,
  SiNetlify,
  SiGithub,
  SiPostman,
  SiFigma,
  SiSlack,
  SiNotion,
  SiMacos,
  SiLinux,
  SiIntellijidea,
  SiPycharm,
  SiWebstorm,
  SiEclipseide,
  SiHeroku,
  SiGitlab,
  SiBitbucket,
  SiInsomnia,
  SiAdobexd,
  SiSketch,
  SiDiscord,
  SiTrello,
  SiJira,
  SiNpm,
  SiYarn,
  SiWebpack,
  SiVite,
  SiBabel,
  SiEslint,
  SiPrettier
} from "react-icons/si";
import {
  DiJava,
  DiJavascript1,
  DiPython,
  DiGit,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiMysql,
  DiPostgresql,
  DiRedis,
  DiDocker
} from "react-icons/di";
import { FaCode, FaAws, FaDocker } from "react-icons/fa";
import { getSkills } from "../../supabase/database";
import { defaultToolStack } from "../../utils/content";

// Icon mapping
const ICON_MAP = {
  SiWindows,
  SiMacos,
  SiLinux,
  SiVisualstudiocode,
  SiIntellijidea,
  SiPycharm,
  SiWebstorm,
  SiEclipseide,
  SiVercel,
  SiNetlify,
  SiHeroku,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiPostman,
  SiInsomnia,
  SiFigma,
  SiAdobexd,
  SiSketch,
  SiSlack,
  SiDiscord,
  SiNotion,
  SiTrello,
  SiJira,
  SiNpm,
  SiYarn,
  SiWebpack,
  SiVite,
  SiBabel,
  SiEslint,
  SiPrettier,
  // Di icons (Devicons)
  DiJava,
  DiJavascript1,
  DiPython,
  DiGit,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiMysql,
  DiPostgresql,
  DiRedis,
  DiDocker,
  // Fa icons (Font Awesome)
  FaCode,
  FaAws,
  FaDocker
};

function Toolstack() {
  const [tools, setTools] = useState(defaultToolStack);

  useEffect(() => {
    const loadTools = async () => {
      const data = await getSkills("tool");
      if (data && data.length > 0) {
        setTools(data.map(tool => ({
          name: tool.name,
          iconName: tool.icon_name
        })));
      }
    };
    loadTools();
  }, []);

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {tools.map((tool, index) => {
        const IconComponent = ICON_MAP[tool.iconName];
        return (
          <Col key={index} xs={4} md={2} className="tech-icons" data-name={tool.name}>
            {IconComponent ? <IconComponent /> : <SiVisualstudiocode />}
          </Col>
        );
      })}
    </Row>
  );
}

export default Toolstack;
