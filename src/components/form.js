import React from 'react'
import ReactDOM from 'react-dom'

export class ChangeForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var id = ReactDOM.findDOMNode(this.refs.id).value.trim();
    if(id) {
      window.location.hash = id;
    }
    ReactDOM.findDOMNode(this.refs.id).value = '';
  }

  render() {
    return (
      <form className="navbar-form navbar-left find-form" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <input type="text" className="form-control" ref="id" placeholder="id or wall" />
        </div>
        <input type="submit" className="btn btn-default" value="Go" />
      </form>
    );
  }
}