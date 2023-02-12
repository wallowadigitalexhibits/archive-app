import React, { Component } from 'react'

class AdminView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      config: {},
      config_loaded: false,

      message: ''
    }
  }

  componentDidMount() {
    this.setState({ config: this.props.config ? this.props.config : [],
                    config_loaded: true })
  }

  handleChangeObj = (e, keyset) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let newConfigObj = Object.assign({}, this.state.config)
    newConfigObj[keyset][name]['val'] = value
    this.setState({ config: newConfigObj })
  }

  handleSubmitObj = (e, keyset, key) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let newConfigObj = Object.assign({}, this.state.config)
    newConfigObj[keyset][name]['val'] = value
    this.setState({ config: newConfigObj })

    this.props.updateConfigInStateAndDb(newConfigObj)

  }

  handleButtonClick = (e, name) => {
    this.setState({ message: name })
    name === 'deploy' ? this.props.deploySite(e) : this.props.runBackup(e)
  }

  render() {

    if (!this.state.config_loaded) {
      return <div>Loading...</div>
    } else {
      return (<div className="admin-wrapper">
                <h1>Admin</h1>

                <form>
                  <div className="form-section">
                    <h2>Paths</h2>
                    {Object.entries(this.state.config['paths'])
                      .map(obj => 
                        <label key={obj[1]['slug']}>
                          <p>{obj[1]['text']}</p>
                          <input name={obj[1]['slug']}
                                 type="text"
                                 value={this.state.config['paths'][obj[1]['slug']]['val']}
                                 onChange={(e)=>this.handleChangeObj(e, 'paths', obj[1]['slug'])}
                                 onBlur={(e)=>this.handleSubmitObj(e, 'paths', obj[1]['slug'])} />
                        </label>)}
                  </div>

                  <div className="form-section">
                    <h2>Backup</h2>
                    <p>Select a folder to run a manual backup.</p>
                    <div>
                      <label>
                        <span>Backup Destination</span>
                        <input name="dest_backup"
                               type="text"
                               value={this.state.config['dest_backup']} />
                      </label>
                    </div>
                    <br />

                    <button onClick={(e)=>this.handleButtonClick(e, 'backup')}>
                      Run Backup
                    </button>

                    <br /><br />

                    <h2>Users</h2>
                    <p>Users will be handled with nodes in db</p>
                    <p>Add User</p>
                    <p>List Users</p>
                  </div>
                  
                  <div className="form-section">
                    <h2>Sites to Deploy</h2>
                    
                    {Object.entries(this.state.config['sites'])
                      .map(obj => 
                        <label key={obj[1]['slug']}>
                          <p>title<br />{obj[1]['title']}</p>
                          <p>url<br />{obj[1]['url']}</p>
                          <p>deploy_server<br />{obj[1]['deploy_server']}</p>

                          <p>Keys</p>
                          <ul>
                            {obj[1]['keys'].map(key => <li key={key}>{key}</li>)}
                          </ul>
                        </label>)}
                    <button onClick={(e)=>this.handleButtonClick(e, 'deploy')}>
                      Deploy Site
                    </button>
                  </div>
                  
                  <div className="form-section">
                    <h2>Organization Info</h2>
                    {Object.entries(this.state.config['org'])
                      .map(obj => 
                        <label key={obj[1]['slug']}>
                          <p>{obj[1]['text']}</p>
                          <input name={obj[1]['slug']}
                                 type="text"
                                 value={this.state.config['org'][obj[1]['slug']]['val']}
                                 onChange={(e)=>this.handleChangeObj(e, 'org', obj[1]['slug'])}
                                 onBlur={(e)=>this.handleSubmitObj(e, 'org', obj[1]['slug'])} />
                        </label>)}

                  </div>
                </form> 

                { this.state.message
                  ? <div className="message"
                         onClick={(e)=>this.setState({ message: '' })}>
                      <p>{this.state.message}</p>
                      <p>Click this message box to close the message.</p>
                    </div>
                  : null }

              </div>)
    }
  }
}

export default AdminView;
