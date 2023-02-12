import React, { Component } from 'react'

class InitialConfigModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      config: {},
      config_loaded: false,

      all_inputs_set: false
    };
  }

  handleChange = (e) => {
    this.setState({value: e.target.value});  
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state)
    //this.props.setDbPathInConfig(this.state)
  }

  componentDidMount() {
    this.setState({ config: this.props.config ? this.props.config : [],
                    config_loaded: true })
  }

  handleChangeObj = (e, keyset) => {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    let newConfigObj = Object.assign({}, this.state.config)
    newConfigObj[keyset][name]['val'] = value
    this.setState({ config: newConfigObj })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let newConfigObj = Object.assign({}, this.state.config)
    let anyEmpty = this.props.checkIfAllPathsAreSet(newConfigObj['paths'])

    if (anyEmpty) {
      console.log('ready', anyEmpty)
      this.setState({ message: '' })
      this.props.updateConfigInStateAndDb(newConfigObj)
      this.props.setInitialConfigModalInState(false)

    } else {
      this.setState({ message: 'Not all required paths are set' })
    }
    

  }

  /** Render **/

  render() {

    if (!this.state.config_loaded) {
      return <div>Loading...</div>

    } else {
      return (
        <div className="init-config-modal-wrapper">
          <h1>Setup</h1>
          <p>The app needs to know where you want to save your files.</p>
          <p>The config file can be manually edited at<br />{this.props.app_dir}</p>

          { this.state.message
            ? <div className="init-config-modal-form-message">
                {this.state.message}
              </div>
            : null }

          <form className="init-config-modal-form">
            <h3>Required</h3>
            <p>Enter a full absolute path, such as <code>C:/Desktop/ArchiveApp/Data/db.json</code></p>
            {Object.entries(this.state.config['paths'])
              .map(obj => 
                <label key={obj[1]['slug']}>
                  <span>{obj[1]['text']}</span>
                  <input name={obj[1]['slug']}
                          type="text"
                          value={this.state.config['paths'][obj[1]['slug']]['val']}
                          onChange={(e)=>this.handleChangeObj(e, 'paths', obj[1]['slug'])} />
                </label>)}

            <h3>Optional</h3>
            {Object.entries(this.state.config['org'])
              .map(obj => 
                <label key={obj[1]['slug']}>
                  <span>{obj[1]['text']}</span>
                  <input name={obj[1]['slug']}
                          type="text"
                          value={this.state.config['org'][obj[1]['slug']]['val']}
                          onChange={(e)=>this.handleChangeObj(e, 'org', obj[1]['slug'])} />
                </label>)}
            <button onClick={(e)=>this.handleSubmit(e)}>Submit</button>
          </form>
        </div>)
    }
  }
}

export default InitialConfigModal;
