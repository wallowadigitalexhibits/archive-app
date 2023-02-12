import React, { Component } from 'react'
import { IoChevronDown,
         IoChevronUp } from 'react-icons/io5'

//import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'

export default class FilteredList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selected_value: this.props.defaultValue,
      show_expanded_list: false,

      filter_string: ''
    }

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);

  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    this.setState({ selected_value: this.props.defaultValue })
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  updateFilterString = (e) => {
    this.setState({ filter_string: e.target.value })
  }

  expandDropdownList = () => {
    this.setState(prevState => ({ show_expanded_list: !prevState.show_expanded_list }));
  }

  handleClickOutside = (event) => {
    console.log('handleClickOutside')
    if (this.wrapperRef 
        && this.wrapperRef.current
        && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ show_expanded_list: false })
    }
  }

  // I have no idea why you need this falsy setting but it works so whatever
  returnSelectedValue = (val) => {
    this.setState({ selected_value: val,
                    filter_string: val })
    this.setState({ show_expanded_list: false })
    this.expandDropdownList()

    let newPayload = Object.assign({}, this.props.payload)
    newPayload['selected_value'] = val

    this.props.resultHandlerFunc(newPayload)
  }

  // TODO: MAKE THE INPUT A TYPEABLE/FILTERABLE INPUT

  renderExpandedList = () => {
    return(
      <div className="filteredlist-expandedlist-wrapper"
           ref={this.wrapperRef}>
        {this.props.radioOptions
          .filter(option => option.toLowerCase()  
                                    .includes(this.state.filter_string.toLowerCase()))
          .map(option => <div key={option}
                              className="filteredlist-expandedlist-item"
                              value={option}
                              onClick={()=>this.returnSelectedValue(option)}>{option}</div>)}
      </div>
    )
  }

  /** Render **/

  render() {

    let message = this.props.payload['defaultMessage']
                  ? this.props.payload['defaultMessage'] 
                  : ''

    return (
      <div className="filteredlist-wrapper"
           onClick={()=>this.expandDropdownList()}>

          <div className="filter-bar">
            <input className="filter-bar-input"
                  value={this.state.filter_string}
                  type="text"
                  placeholder="What kind of node?"
                  onChange={(e)=>this.updateFilterString(e)} />
            <div className="filteredlist-filter-icon">
              { this.state.show_expanded_list
                ? <IoChevronUp size={'20px'} />
                : <IoChevronDown size={'20px'} />}
            </div>  
          </div>

          {this.state.show_expanded_list
            ? this.renderExpandedList()
            : null}

      </div>
    )
  }
}
