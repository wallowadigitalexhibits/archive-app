import React, { Component } from 'react'
import { BsFillEyeFill } from 'react-icons/bs'
import { MdAddCircleOutline } from 'react-icons/md'

class ListNode extends Component {

  renderDueDate = (nodeIdList) => {
    let dueDates = this.props.getAllNodeObjFromListOfIds(nodeIdList, false)
    return dueDates.map(tag => this.props.renderTag('Due', tag['label_props']['strDate']))
  }

  render() {
    let node = this.props.node
    let layout = this.props.layout

    let color = this.props.getLabelColor(node['core_props']['label'])
    let border = `30px solid ${color}`

    switch (layout) {
      case 'obj':
        return (<div className="node__list__wrapper">
                  <div className="node__list__header" 
                       style={{ color: color,
                                borderBottom: border }}>
                    <div><strong>{node['core_props']['label']}</strong></div>
                    <BsFillEyeFill />
                  </div>

                  <div className="node__list__content">
                    <div className="node__list__flex-column node__list__flex-left-column">
                      <div>
                        <div className="node__list__form-label" style={{ color: color }}>strText</div>
                        <div style={{ fontSize: '22px' }}>{node['label_props']['strText']}</div>
                      </div>
                      <div>
                        <div className="node__list__form-label" style={{ color: color }}>
                          relDueDate <MdAddCircleOutline className="react-icon" />
                        </div>
                        {node['label_props']['relDueDate'].length > 0
                         ? this.renderDueDate(node['label_props']['relDueDate'])
                         : null}
                      </div>
                      <div>
                        <div className="node__list__form-label" style={{ color: color }}>relRelatedNodes</div>
                        <div>related nodes</div>
                      </div>
                      <div>
                        <div className="node__list__form-label" style={{ color: color }}>relRelatedProjects</div>
                        <div>related projects</div>
                      </div>
                      <div>
                        <div className="node__list__form-label" style={{ color: color }}>
                          <span>Other Node Properties</span>
                        </div>
                        { Object.keys(node['label_props'])
                          .filter(key => key !== 'strText')
                          .filter(key => key !== 'boolIsDone')
                          .filter(key => key !== 'relDueDate')
                          .filter(key => key !== 'relRelatedNodes')
                          .filter(key => key !== 'relRelatedProjects')
                          .map(key => <div key={key}>{key}</div>) }
                      </div>
                    </div>
                    <div className="node__list__flex-column">
                      <div>
                        <div className="node__list__form-label" style={{ color: color }}>boolIsDone</div>
                        <div>{this.props.renderCheckbox(node['label_props']['boolIsDone'])}</div>
                      </div>
                    </div>
                  </div>
                </div>)

      case 'listitem':
        return (<div className="node__list__listitem" 
                     style={{ borderLeft: border }}
                     onClick={(e)=>this.props.setWhichObjAndView(node, 'work')}>
                  <div>{this.props.renderCheckbox(node['label_props']['boolIsDone'])}</div>
                  <div>{node['label_props']['strText']}</div>
                  <div>due date</div>
                </div>)

      case 'gridcard':
      default:
        return (<div>
                  <div>{this.props.renderCheckbox(node['label_props']['boolIsDone'])}</div>
                  <div>{node['label_props']['strText']}</div>
                  <div>due date</div>
                  <div>related Project</div>
                </div>)
    }
  }

}
export default ListNode;
