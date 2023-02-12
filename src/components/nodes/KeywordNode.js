import React, { Component } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'

export default class KeywordNode extends Component {

  render() {
    let node = this.props.node
    let layout = this.props.layout

    switch (layout) {
      case 'obj':
        return (<div className="node__keyword__wrapper">
                  <div className="node__keyword__content">
                      <div className="node__keyword__title">
                        {node['label_props']['strText']}
                      </div>
                      
                      <div className="node__keyword__type">
                        Keyword • {node['label_props']['radioKeywordType']}
                      </div>
                      <div className="node__keyword__desc">
                        {node['label_props']['strDescription']}
                      </div>
                      <div className="node__keyword__related-items-title">
                        Related Items
                      </div>
                      <div className="node__keyword__related-items">
                        {node['label_props']['relItems']
                          .map(idStr => <div key={idStr}>{this.props.renderNode(idStr, 'gridcard')}</div>)}
                      </div>
                      <div>
                        {node['label_props']['relLists']
                          .map(idStr => <div>{idStr}</div>)}
                      </div>
                    </div>
                </div>)

      case 'list':
        return (<tr className="node__keyword__listitem" 
                     onClick={()=>this.props.setWhichObj(node)}>
                  <td>{node['label_props']['strText']}</td>
                  <td>{node['label_props']['relItems'].length} related items</td>
                  <td>{node['label_props']['relLists'].length} related lists</td>
                </tr>)

      case 'grid':
      default:
        return (<div className="node__keyword__gridcard-wrapper"
                     onClick={()=>this.props.setWhichObj(node)}>
                  <div className="node__keyword__gridcard-radiotype" >
                    Keyword
                  </div>
                  <div className="node__keyword__gridcard-text">
                  {node['label_props']['strText']}
                  </div>
                  <div className="node__keyword__gridcard-related">
                    {node['label_props']['relItems'].length} items
                    • {node['label_props']['relLists'].length} lists</div>
                </div>)
    }
  }

}
