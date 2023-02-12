import React, { Component } from 'react'
import ItemsCollection from '../collections/ItemsCollection.js'
import KeywordsCollection from '../collections/KeywordsCollection.js'
import ListHeader from '../elements/Listheader.js'

import { MdOutlineListAlt, MdOutlineGridView } from 'react-icons/md'

class ResearcherView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      layout: 'grid',

      search_string: '',

      show_items: true,
      show_keywords: true
    }
  }
  
  renderToggleGridList = () => {

    let activeColor = 'black'
    let inactiveColor = 'gray'

    return(
      <div className="toggle-grid-list">
        <div className="toggle-grid-list-icons">
          <label className="toggle-grid-list-icon-label"
                 onClick={()=>this.setState({ layout: 'grid' })}>
            <MdOutlineGridView size={'20px'}
                               className="toggle-grid-list-icon"
                               color={this.state.layout === 'grid' 
                                      ? activeColor 
                                      : inactiveColor} /> 
            <span>Grid</span>
          </label>
          <label className="toggle-grid-list-icon-label"
                 onClick={()=>this.setState({ layout: 'list' })}>
            <MdOutlineListAlt size={'20px'}
                              className="toggle-grid-list-icon"
                              color={this.state.layout === 'list' 
                                     ? activeColor 
                                     : inactiveColor} /> 
            <span>List</span>
          </label>
        </div>
      </div>)
  }

  renderWHCTypesList = () => {

    let itemNodesToRender = this.props.nodes
      .slice()
      .filter(node => node['core_props']['label'] === 'Item')

    let radioWHCTypes = itemNodesToRender
      .map(node => node['label_props']['radioWHCType'])

    let setRadioWHCTypes = radioWHCTypes.filter((item, i, ar) => ar.indexOf(item) === i);
    
    return setRadioWHCTypes.map(val => <p>{val}</p>)
  }

  renderSSF = () => {
    return (<div className="researcher-ssf">
              { this.renderToggleGridList() }

              <p>Search</p>
              <div className="researcher-ssf-search-bar">
                <input type="text" />
              </div>

              <div className="researcher-ssf-checkboxes">
                <label>
                  <input  className="input-researcher"
                          type="checkbox"
                          checked={this.state.show_keywords}
                          onChange={(e)=>this.setState({ 'show_keywords': e.target.checked })} />  
                  <span>Keywords</span>
                </label>
                <label>
                  <input  className="input-researcher"
                          type="checkbox" 
                          checked={this.state.show_items}
                          onChange={(e)=>this.setState({ 'show_items': e.target.checked })} /> 
                  <span>Items</span>
                </label>
              </div>

              <div className="researcher-ssf-checkboxes">
                <strong>Filter by Item Type</strong>
                { this.renderWHCTypesList() }
              </div>
            </div>)
  }

  renderListCollection = (nodes, label) => {
    return (<table className='nodes__list'>
              <tbody>
                { nodes.map(node => this.props.renderNode(node, this.state.layout)) }
              </tbody>
            </table>)
  }

  renderGridCollection = (nodes) => {
    return (<div className='nodes__grid'>
              { nodes.map(node => this.props.renderNode(node, this.state.layout)) }
            </div>)    
  }

  renderResults = () => {

    let keywordNodesToRender = []
    if (this.state.show_keywords) {
      keywordNodesToRender = this.props.nodes
                                .filter(node => node['core_props']['label'] === 'Keyword')
    }

    let itemNodesToRender = []
    if (this.state.show_items) {
      itemNodesToRender = this.props.nodes
                                .filter(node => node['core_props']['label'] === 'Item')
    }

    // calculate this automatically from a list of results nodes
    let summaryString = 'Your search returned ' + 
                        itemNodesToRender.length + 
                        ' items and ' + 
                        keywordNodesToRender.length + 
                        ' keywords.'

    return (<div className="researcher-results">
              <p>{summaryString}</p>
              { this.state.show_items
                ? this.state.layout === 'grid'
                  ? this.renderGridCollection(itemNodesToRender)
                  : this.renderListCollection(itemNodesToRender, 'Item') 
                : null }

              { this.state.show_keywords
                ? this.state.layout === 'grid'
                  ? this.renderGridCollection(keywordNodesToRender)
                  : this.renderListCollection(keywordNodesToRender, 'Keyword') 
                : null }
            </div>)
  }

  renderObj = () => {
    return (<div className="researcher-item">
              { Object.entries(this.props.which_obj).length > 0
                ? this.props.renderNode(this.props.which_obj, 'obj')
                : null}
            </div>)
  }

  render() {
    return (<div className="researcher-wrapper">
              { this.renderSSF() }
              { this.renderResults() }
              { this.renderObj() }
            </div>)
  }
}

export default ResearcherView;
