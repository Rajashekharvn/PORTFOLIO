import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import {
  DiJavascript1,
  DiPython,
  DiGit,
  DiJava,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiMysql,
  DiPostgresql,
  DiRedis,
  DiDocker
} from "react-icons/di";
import {
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiCplusplus,
  SiC,
  SiCsharp,
  SiPhp,
  SiRuby,
  SiGo,
  SiRust,
  SiKotlin,
  SiSwift,
  SiFlutter,
  SiAngular,
  SiVuedotjs,
  SiNextdotjs,
  SiExpress,
  SiDjango,
  SiFlask,
  SiSpring,
  SiGraphql,
  SiFirebase,
  SiSupabase
} from "react-icons/si";
import { FaAws, FaCode, FaDocker } from "react-icons/fa";
import { getSkills } from "../../supabase/database";
import { defaultTechStack } from "../../utils/content";

// Icon mapping
const ICON_MAP = {
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
  SiHtml5,
  SiCss3,
  SiTypescript,
  SiCplusplus,
  SiC,
  SiCsharp,
  SiPhp,
  SiRuby,
  SiGo,
  SiRust,
  SiKotlin,
  SiSwift,
  SiFlutter,
  SiAngular,
  SiVuedotjs,
  SiNextdotjs,
  SiExpress,
  SiDjango,
  SiFlask,
  SiSpring,
  SiGraphql,
  SiFirebase,
  SiSupabase,
  FaCode,
  FaAws,
  FaDocker
};

function Techstack() {
  const [skills, setSkills] = useState(defaultTechStack);

  useEffect(() => {
    const loadSkills = async () => {
      const data = await getSkills("tech");
      if (data && data.length > 0) {
        setSkills(data.map(skill => ({
          name: skill.name,
          iconName: skill.icon_name
        })));
      }
    };
    loadSkills();
  }, []);

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {skills.map((skill, index) => {
        const IconComponent = ICON_MAP[skill.iconName];
        return (
          <Col key={index} xs={4} sm={3} md={2} className="tech-icons" data-name={skill.name}>
            {IconComponent ? <IconComponent /> : <FaCode />}
          </Col>
        );
      })}
    </Row>
  );
}

export default Techstack;
