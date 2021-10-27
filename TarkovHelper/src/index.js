import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {Global, css} from '@emotion/react';

import App from './App';

const globalStyle = css`
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap');
  body{
    font-family: 'Source Sans Pro', sans-serif;
  }
`;

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Global styles = {globalStyle} />
    <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
