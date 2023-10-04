import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    padding: 0;
    margin: 0;
    -webkit-app-region: drag;
  }

  button {
    -webkit-app-region: no-drag;
  }

  *::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  * {
    box-sizing: border-box;
  }
`;
