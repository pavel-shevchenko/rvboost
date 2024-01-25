import React from 'react';
import styled from 'styled-components';
import GoogleButton from 'react-google-button';

const StyledGoogleButton = styled(GoogleButton)`
  margin-top: 2rem;
`;

export const GoogleStyledButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledGoogleButton
      style={{ width: '100%' }}
      label="Sign-Up with Google"
      onClick={onClick}
    />
  );
};
