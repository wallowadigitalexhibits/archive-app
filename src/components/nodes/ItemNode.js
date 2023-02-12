import React, { Component } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'

class ItemNode extends Component {

  render() {
    let node = this.props.node
    let layout = this.props.layout

    switch (layout) {
      case 'obj':

      return (<div className="node__item__wrapper">
      <div className="node__item__content">
          <div className="node__item__title">
            {node['label_props']['strTitle']}
          </div>
          
          <div className="node__item__type">
            Item • {node['label_props']['radioWHCType']}
          </div>
          <div className="node__item__desc">
            {node['label_props']['strDescription']}
          </div>
          <div className="node__item__related-items-title">
            Related Items
          </div>
          <div className="node__item__related-items">
            {node['label_props']['relRelatedItems']
              .map(idStr => <div key={idStr}>{this.props.renderNode(idStr, 'gridcard')}</div>)}
          </div>
          <div>
            {node['label_props']['relRelatedLists']
              .map(idStr => <div>{idStr}</div>)}
          </div>
        </div>
    </div>)

        return (<div className="node__item__wrapper">
                  <div className="node__item__header">
                    <div><strong>{node['core_props']['label']}</strong></div>
                    <BsFillEyeFill />
                  </div>

                  <div className="node__item__content">
                    <div className="node__item__flex-column node__item__flex-left-column">
                    <div>
                        <div className="node__item__form-label">strName</div>
                        <div style={{ fontSize: '22px' }}>{node['label_props']['strTitle']}</div>
                      </div>
                      <div>
                        <div className="node__item__form-label">strSlug</div>
                        <div style={{ fontSize: '22px' }}>{node['label_props']['strBriefDescription']}</div>
                      </div>
                      <div>
                        <div className="node__item__form-label">relLists</div>
                        <div>{node['label_props']['relRelatedLists'].length} related lists</div>
                      </div>
                    </div>
                  </div>
                </div>)

      case 'list':
        return (<tr className="node__item__listitem" 
                     onClick={()=>this.props.setWhichObj(node)}>
                  <td>{node['label_props']['strTitle']}</td>
                  <td>{node['label_props']['strBriefDescription']}</td>
                  <td>{node['label_props']['relRelatedLists'].length} related lists</td>
                </tr>)

      case 'grid':
      default:
        

        return (<div className="node__item__gridcard-wrapper"
                     onClick={()=>this.props.setWhichObj(node)}>
                  <div className="node__item__gridcard-thumb"></div>
                  <div className="node__item__gridcard-title">
                    {node['label_props']['strTitle']}
                  </div>
                  <div className="node__item__gridcard-desc">
                    {node['label_props']['strBriefDescription']}
                  </div>
                </div>)


        return (<div className="node__item__gridcard"
                     onClick={()=>this.props.setWhichObj(node)}>
                  <div>{node['label_props']['strTitle']}</div>
                  <div>{node['label_props']['strBriefDescription']}</div>
                  <div>{node['label_props']['relRelatedLists'].length} related lists</div>
                </div>)
    }
  }

}
export default ItemNode;
