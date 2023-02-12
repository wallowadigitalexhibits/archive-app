import React, { Component } from 'react'

class KeywordsCollection extends Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {

    return (<div className="collection-wrapper">
              <h2>Keywords</h2>

              {this.props.keywords
                .map(keyword => <p key={keyword.text}>{keyword.text}</p>)}
            </div>)
  }
}

export default KeywordsCollection;
