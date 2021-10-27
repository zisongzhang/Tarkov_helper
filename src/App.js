import React from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import queryString from 'query-string';

import Tarkovhelper from './tarkovhelper';

function useQueryString() {
  return queryString.parse(useLocation().search);
}

function App() {
  return (
    // <h1>
    //   Hmm... I wonder what the forecast is...
    // </h1>
    <div>
    <Switch>
        <Route path="/tarkovhelper">
          <Tarkovhelper query={useQueryString().q}/>
        </Route>
        <Route exact path="/">
          <Redirect to="/tarkovhelper" />
        </Route>
    </Switch>
    </div>
  );
}

export default App;
