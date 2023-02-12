import React, { Component } from 'react'

class ItemsCollection extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {

    return (<div className="collections-wrapper">
              <h2>{this.props.layout} Items</h2>

              {this.props.items
                .map(item => <p key={item.id}>{item.title}</p>)}
            </div>)
  }
}

export default ItemsCollection;
