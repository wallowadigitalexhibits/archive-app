import React, { Component } from 'react'
import { IoClose } from 'react-icons/io5'

class CreateNodeModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listOfLabels: [],
      label: '',
      newObj: {}
    }
  }

  componentDidMount() {
    let options = {'list': this.props.nodes.slice(),
                   'returnType': 'strings'}
    let listOfLabels = this.props.crudList('GET_LIST_OF_LABELS',
                                           options)
    this.setState({ 'listOfLabels': listOfLabels})
  }

  handleUserSelection = (payload) => {

    let options = {'list': this.props.nodes.slice(),
                   'user': this.props.user,
                   'label': payload['selected_value']}

    let resObj = this.props.crudList('CREATE_NODE_FROM_LABEL',
                                     options)

    this.setState({ label: payload['selected_value'],
                    newObj: resObj })

    // no need for bidirectionality enforcement here
    // this is an empty object

    options = {'list': this.props.nodes.slice(),
               'user': this.state.user,
               'nodeToAdd': resObj}

    let res = this.props.crudList('ADD_NODE',
                                  options)

    // return the resulting list

    this.props.updateDbInStateAndDb(res)

  }

  
  /************/
  /** Render **/
  /************/

  render() {

    return (
      <div className="create-node-modal-wrapper">

        <IoClose className="create-node-modal-icon" 
                 size="40px"
                 onClick={()=>this.props.setCreateNodeModal(false, {})} />

        <strong>CreateNodeModal</strong>

        <br /><br /><br />

        {this.props.renderFilteredList(this.props.payload,
                                       '',
                                       this.state.listOfLabels,
                                       this.handleUserSelection)}

        <br />

        { this.state.label 
          ? <div>
              <div>You have added an object with the label {this.state.label}.</div>
              <br />
              <button onClick={()=>this.props.setCreateNodeModal(false, this.state.newObj)}>
                Edit the object
              </button>
              <button onClick={()=>this.props.setCreateNodeModal(false, {})}>
                Close without editing
              </button>
            </div>
          : null }


      </div>
    );
  }
}

export default CreateNodeModal;
