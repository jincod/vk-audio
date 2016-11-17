import React, {Component} from 'react';
import {Link} from 'react-router';

export default class QueryHistory extends Component {
  render() {
    var history = localStorage.getItem('history') && JSON.parse(localStorage.getItem('history')) || [];
    history = history.sort();
    
    return (
      <div className="layout history-block">
        <h1>History</h1>
        <div className="history-block__list">
        {
          history.map((item, index) => {
            return (
              <Link
                key={index}
                to={'/' + item}
                className="history-block__item"
              >
                {item}
              </Link>
            );
          })
        }
        </div> 
        {this.props.children}
      </div>
    )
  }
}