import styled from 'styled-components';

export const HomeContainer = styled.div`
  background-color: #403f4c;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  color: #fff;
  padding: 0 24px;
`;

export const HomeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
  font-size: 46px;
  text-align: center;
`;

export const HomeDescription = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  font-size: 18px;
`;

export const HomeContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  font-size: 20px;
  gap: 12px;
`;
