import 'babel-polyfill';
import request from 'superagent';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import {createHashHistory} from 'history';
import Player from './player';
import QueryHistory from './query-history';

require('./styles/styles.less');

class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

var routes = (
  <Router history={appHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Player} />
      <Route path="history" component={QueryHistory} />
      <Route path=":playlistId" component={Player} />
    </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('content'));