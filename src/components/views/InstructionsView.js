import React, { Component } from 'react'

class InstructionsView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      layout: 'card',

      nodes: [],
      nodes_loaded: false
    }
  }

  componentDidMount() {
    this.setState({ nodes: this.props.nodes ? this.props.nodes : [],
                    nodes_loaded: true })
  }

  render() {

    if (!this.state.nodes_loaded) {
      return <div>Loading...</div>
    } else {
      return (<div className="instructions-wrapper">
                <h1>Instructions</h1>
                <p>Show each template with its default values in a small table</p>
              </div>)
    }
  }
}

export default InstructionsView;
