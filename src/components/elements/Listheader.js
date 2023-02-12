import React, { Component } from 'react'

export default class ListHeader extends Component {

  render() {
    if (this.props.label === 'Item') {
      return (
        <tr className="item-list-header">
          <td>Item</td>
          <td>Title</td>
          <td>Brief Description</td>
          <td>Related Lists</td>
        </tr>
      )
    } else if (this.props.label === 'Keyword') {
      return (
        <tr className="keyword-list-header">
          <td>Keyword</td>
          <td>Type</td>
          <td>Text</td>
          <td>Description</td>
        </tr>
      )
    }
  }
}
