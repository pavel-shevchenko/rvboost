import styled from 'styled-components';
import Lottie from 'lottie-react';

import LoadingOverlaySpinner from './loadingOverlaySpinner.json';

const StyledOverlay = styled.div`
  z-index: 100;
  background-color: black;
  opacity: 0.4;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Loader = styled.div`
  z-index: 101;
  position: fixed;
  top: 30%;
  left: calc(50% - 100px);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  perspective: 480px;
`;

export const LoadingOverlay = () => (
  <div>
    <Loader>
      <Lottie animationData={LoadingOverlaySpinner} />
    </Loader>
    <StyledOverlay />
  </div>
);
