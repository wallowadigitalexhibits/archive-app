import React, { Component } from 'react'

class ProgrammerView extends Component {

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
      return (<div className="programmer-wrapper">
                <h1>Programmer</h1>
              </div>)
    }
  }
}

export default ProgrammerView;
