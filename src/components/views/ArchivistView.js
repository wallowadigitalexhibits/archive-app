import React, { Component } from 'react'

class ArchivistView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      layout: 'card',
      user: 'Default User',

      items: [],
      keywords: [],
      data_loaded: false     
    }
  }

  componentDidMount() {
    this.setState({ items: this.props.items ? this.props.items : [],
                    keywords: this.props.keywords ? this.props.keywords : [],
                    data_loaded: true })
  }

  render() {

    if (!this.state.data_loaded) {
      return <div>Loading...</div>
    } else {
      return (<div className="archivist-wrapper">
              </div>)
    }
  }
}

export default ArchivistView;
