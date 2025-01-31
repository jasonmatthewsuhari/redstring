import React from "react";
import styled from "styled-components";

const DotBackground: React.FC = () => {
  return <StyledBackground />;
};

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #121212;
  background-image: radial-gradient(rgba(200, 200, 200, 0.2) 1px, transparent 1px);
  background-size: 10px 10px;
  z-index: -1;
`;

export default DotBackground;
