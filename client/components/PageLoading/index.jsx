import styled, { keyframes } from "styled-components";
import React from "react";

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(0.85);
    opacity: 0.6;
    box-shadow: 0 0 10px rgba(0, 112, 243, 0.4);
  }
  100% {
    transform: scale(1.15);
    opacity: 1;
    box-shadow: 0 0 25px rgba(0, 112, 243, 0.8), 0 0 40px rgba(255, 0, 122, 0.5);
  }
`;

const textGlow = keyframes`
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  position: ${props => props.$fixed ? "fixed" : "absolute"};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  transition: all 0.3s ease-in-out;
`;

const LoaderWrapper = styled.div`
  position: relative;
  width: 65px;
  height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OuterRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #0070f3;
  border-bottom-color: #ff007a;
  border-radius: 50%;
  animation: ${spin} 1.2s cubic-bezier(0.5, 0.1, 0.4, 0.9) infinite;
`;

const InnerRing = styled.div`
  position: absolute;
  width: 75%;
  height: 75%;
  border: 3px solid transparent;
  border-left-color: #00df89;
  border-right-color: #7928ca;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite reverse;
`;

const CenterDot = styled.div`
  position: absolute;
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, #0070f3, #7928ca);
  border-radius: 50%;
  animation: ${pulse} 1s ease-in-out infinite alternate;
`;

const LoadingText = styled.span`
  margin-top: 20px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #111;
  letter-spacing: 0.5px;
  animation: ${textGlow} 1.2s ease-in-out infinite alternate;
`;

const PageLoading = ({ fixed = false, text = "Đang tải dữ liệu..." }) => {
    return (
        <LoadingOverlay $fixed={fixed}>
            <LoaderWrapper>
                <OuterRing />
                <InnerRing />
                <CenterDot />
            </LoaderWrapper>
            {text && <LoadingText>{text}</LoadingText>}
        </LoadingOverlay>
    );
};

export default PageLoading;