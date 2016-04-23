import React from 'react'
import ReactDOM from 'react-dom'

export class GoForm extends React.Component {
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
      <form className="go-form" onSubmit={this.handleSubmit}>
        <input type="text" className="go-form__input" ref="id" placeholder="id or wall" />
      </form>
    );
  }
}