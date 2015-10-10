import React from 'react'
import {Link} from 'react-router'


export class QueryHistory extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var history = localStorage.getItem('history') && JSON.parse(localStorage.getItem('history')) || [];
    
    return (
      <div>
        <h1>History</h1>
        <ul className="list-group track-list">
        {
          history.map((item, index) => {
            return (
              <li key={index} className="list-group-item">
                <Link to={'/' + item}>{item}</Link>
              </li>
            )
          })
        }
        </ul>
        {this.props.children}
      </div>
    )
  }
}