import request from 'superagent'
import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import createHistory from 'history/lib/createHashHistory'
import { Player } from './player'
import { QueryHistory } from './query-history'


class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

var history = createHistory({queryKey: false});

var routes = (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Player} />
      <Route path="history" component={QueryHistory} />
      <Route path=":playlistId" component={Player} />
    </Route>
  </Router>
);

React.render(routes, document.getElementById('content'));