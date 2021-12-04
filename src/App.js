import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import {css} from '@emotion/react';

import Header from './components/Header'
import Tarkovhelper from './tarkovhelper';

function useQueryString() {
  return queryString.parse(useLocation().search);
}

function App() {

  const homeContainer = css`
        padding: 0px;
        margin: 0px;
        border: 0;
    `;

  return (
    // <h1>
    //   Hmm... I wonder what the forecast is...
    // </h1>
    <div css={homeContainer}>
    <Header />
    <Switch>
        <Route path="/tarkovhelper">
          {console.log("useQueryString(): ", useQueryString())}
          <Tarkovhelper query={useQueryString().character} query_bullet={useQueryString().bullet}/>
        </Route>
        <Route exact path="/">
          <Redirect to="/tarkovhelper" />
        </Route>
    </Switch>
    </div>
  );
}

export default App;
