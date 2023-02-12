import React, { Component } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'

class UserNode extends Component {

  render() {
    let node = this.props.node
    let layout = this.props.layout

    switch (layout) {
      case 'obj':
        return (<div className="node__user__wrapper">
                  <div className="node__user__header">
                    <div><strong>{node['core_props']['label']}</strong></div>
                    <BsFillEyeFill />
                  </div>

                  <div className="node__user__content">
                    <div className="node__user__flex-column node__user__flex-left-column">
                    <div>
                        <div className="node__user__form-label">strName</div>
                        <div style={{ fontSize: '22px' }}>{node['label_props']['strName']}</div>
                      </div>
                      <div>
                        <div className="node__user__form-label">strSlug</div>
                        <div style={{ fontSize: '22px' }}>{node['label_props']['strSlug']}</div>
                      </div>
                      <div>
                        <div className="node__user__form-label">relLists</div>
                        <div>related lists</div>
                      </div>
                    </div>
                  </div>
                </div>)

      case 'list':
        return (<tr className="node__user__listitem" 
                     onClick={()=>this.props.setWhichObj(node)}>
                  <td>{node['label_props']['strName']}</td>
                  <td>{node['label_props']['strSlug']}</td>
                  <td>{node['label_props']['relLists'].length} related lists</td>
                </tr>)

      case 'grid':
      default:
        return (<div className="node__user__gridcard"
                     onClick={()=>this.props.setWhichObj(node)}>
                  <div>{node['label_props']['strName']}</div>
                  <div>{node['label_props']['strSlug']}</div>
                  <div>{node['label_props']['relLists'].length} related lists</div>
                </div>)
    }
  }

}
export default UserNode;
