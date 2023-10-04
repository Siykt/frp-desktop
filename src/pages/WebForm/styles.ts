import styled from 'styled-components';

export const WebFormContainer = styled.div`
  background-color: #403f4c;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 0 24px;
`;

export const WebFormHeader = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  font-size: 28px;
`;

export const WebFormSubHeader = styled(WebFormHeader)`
  font-size: 18px;
  margin: 12px 0;
`;

export const WebFormContent = styled.form`
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
  -webkit-app-region: no-drag;
  margin-top: 16px;

  input {
    color: #000;
  }
`;

export const WebFormButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0 10vh;
  gap: 12px;
`;
