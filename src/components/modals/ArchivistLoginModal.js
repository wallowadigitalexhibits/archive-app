import React, { Component } from 'react'

class ArchivistLoginModal extends Component {

  /** Render **/

  renderAvatarInitials = (userObj) => {
    let userName = userObj['label_props']['strName']

    if (userName.includes(' ')) {
      let idx = userName.indexOf(' ')

      if (idx >= 0) {
        return userName[0].toUpperCase() + userName[idx+1].toUpperCase()
      } else {
        return userName[0].toUpperCase() + userName[1].toUpperCase()
      }
    } else {
      return userName.toUpperCase()[0] + userName.toUpperCase()[1]
    }
  }

  renderUser = (userObj) => {
    return (<div key={userObj['core_props']['id']}
                 className="archivist-login-modal-user"
                 onClick={(e)=>this.props.setArchiveViewWithUser(e, userObj)}>
              
              <div className="archivist-login-modal-user-avatar">
                {this.renderAvatarInitials(userObj)}
              </div>
              <div>{userObj['label_props']['strName']}</div>
            </div>)
  }

  render() {
    return (
      <div className="archivist-login-modal">
        {this.props.users.length > 0
        ? <div>
            <p>Select your Archivist account</p>
            {this.props.users
              .sort((a, b) => a['label_props']['name'] > b['label_props']['name'] ? 1 : -1)
              .map(user => this.renderUser(user))}
          </div>
        : <p>Create a new user account</p>}
      </div>
    )
  }
}

export default ArchivistLoginModal;
