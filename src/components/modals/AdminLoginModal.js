import React, { Component } from 'react'

class AdminLoginModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      password: ''
    }
  }

  handleSubmit = (e) => {

    let password = e.target.value
    let user = 'admin'
    let view = 'admin'

    if (password === 'admin') {
      
    }

    this.props.setUser('admin')

  }



  /** Render **/

  renderUser = (userObj) => {
    return (<div key={userObj['id']}
                 className="archivist-login-modal-user"
                 onClick={(e)=>this.props.setArchiveViewWithUser(e, userObj)}>
              
              <div className="archivist-login-modal-user-avatar">
                {this.renderAvatarInitials(userObj)}
              </div>
              <div>{userObj['name']}</div>
            </div>)
  }

  render() {
    return (
      <div className="admin-login-modal">
        <p>Enter the administrator password:</p>
        <input className="admin-login-modal-input"
                  value={this.state.password}
                  type="text"
                  placeholder="Click to enter password..."
                  onChange={(e)=>this.updateFilterString(e)}
                  onBlur={(e)=>this.handleSubmit(e)} />
      </div>
    )
  }
}

export default AdminLoginModal;
