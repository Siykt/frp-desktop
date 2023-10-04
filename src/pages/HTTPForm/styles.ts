import styled from 'styled-components';

export const HTTPFormContainer = styled.div`
  background-color: #403f4c;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`;

export const HTTPFormHeader = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  font-size: 28px;
`;

export const HTTPFormContent = styled.form`
  display: flex;
  flex: 1;
  min-height: 1px;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  overflow: auto;
  gap: 6px;
  width: 100%;
  padding: 0 12px;
  margin-top: 16px;
  -webkit-app-region: no-drag;

  input {
    color: #000;
  }
`;
