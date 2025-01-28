import React from 'react';
import styled from 'styled-components';
import { Code } from 'lucide-react';

// Interface for props
interface CardProps {
  title: string;
  content: string;
  seeMoreText: string;
}

const Card: React.FC<CardProps> = ({ title, content, seeMoreText }) => {
  return (
    <StyledWrapper>
      <div className="parent">
        <div className="card">
          <div className="content-box">
            <span className="card-title">{title}</span>
            <p className="card-content">{content}</p>
            <span className="see-more">{seeMoreText}</span>
          </div>
          <div className="icon-box">
            <Code className="code-icon" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .parent {
    width: 300px;
    padding: 20px;
    perspective: 1000px;
  }

  .card {
    padding-top: 50px;
    border: 3px solid rgba(255, 255, 255, 0.7);
    transform-style: preserve-3d;
    background: linear-gradient(
        135deg,
        rgba(139, 0, 0, 0.2) 18.75%,
        rgba(90, 0, 0, 0.8) 0 31.25%,
        rgba(139, 0, 0, 0.2) 0
      ),
      repeating-linear-gradient(
        45deg,
        rgba(90, 0, 0, 0.8) -6.25% 6.25%,
        rgba(139, 0, 0, 0.2) 0 18.75%
      );
    background-size: 60px 60px;
    background-position: 0 0, 0 0;
    background-color: rgba(50, 0, 0, 0.9);
    width: 100%;
    box-shadow: rgba(255, 50, 50, 0.3) 0px 30px 30px -10px;
    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
  }

  /* Hover effect: gentle bob upwards */
  .card:hover {
    transform: translateY(-10px); /* Moves up slightly */
    box-shadow: rgba(255, 50, 50, 0.5) 0px 40px 40px -15px; /* Enhances shadow for depth */
  }

  .content-box {
    background: rgba(139, 0, 0, 0.7);
    padding: 60px 25px 25px 25px;
    transform-style: preserve-3d;
    transition: all 0.5s ease-in-out;
  }

  .content-box .card-title {
    display: inline-block;
    color: #fff;
    font-size: 25px;
    font-weight: 900;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 50px);
  }

  .content-box .card-content {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 200, 200, 0.9);
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 30px);
  }

  .content-box .see-more {
    cursor: pointer;
    margin-top: 1rem;
    display: inline-block;
    font-weight: 900;
    font-size: 9px;
    text-transform: uppercase;
    color: rgb(255, 120, 120);
    background: white;
    padding: 0.5rem 0.7rem;
    transition: all 0.5s ease-in-out;
    transform: translate3d(0px, 0px, 20px);
  }

  .icon-box {
    position: absolute;
    top: 30px;
    right: 30px;
    height: 50px;
    width: 50px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 120, 120, 0.9);
    padding: 10px;
    transform: translate3d(0px, 0px, 80px);
    box-shadow: rgba(255, 80, 80, 0.4) 0px 17px 10px -10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .code-icon {
    color: rgb(255, 100, 100);
    font-size: 24px;
  }
`;

export default Card;
