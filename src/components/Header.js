import React, { Component } from 'react'

import { ReactComponent as HomeIcon } from '../icons/home.svg';
import { ReactComponent as AdminIcon } from '../icons/admin.svg';
import { ReactComponent as ArchivistIcon } from '../icons/archivist.svg';
import { ReactComponent as InstructionsIcon } from '../icons/instructions.svg';
//import { ReactComponent as ProgrammerIcon } from '../icons/programmer.svg';
import { ReactComponent as ResearcherIcon } from '../icons/researcher.svg';

class Header extends Component {

  renderIcon = () => {
    switch(this.props.view) {
      case 'admin':
        return(<AdminIcon className="header__view-icon" />)
      case 'archivist': 
        return(<ArchivistIcon className="header__view-icon" />)
      case 'instructions':
        return(<InstructionsIcon className="header__view-icon" />)
      case 'researcher':
        return(<ResearcherIcon className="header__view-icon" />)
      default:
        return null
    }
  }

  renderNav = () => { 
    switch(this.props.view) {
      case 'archivist':
        return(<div>
                 You are logged in as <strong>{this.props.user['label_props']['strName']}</strong>
               </div>)
      default:
        return(null)
    }
  }

  render() {

    return (<header>
              <div className="header__title"
                   onClick={(e)=>this.props.setView(e, '')}>
                <HomeIcon className="header__icon" style={{ height: '40px', 
                                                            maxHeight: '80%' }}/>
                <h1>Archive App</h1>
              </div>

             { this.renderNav() }

              <div className="header__view">
                {this.renderIcon()}
                {this.props.view[0].toUpperCase() + this.props.view.substring(1)}
              </div>
            </header>)
  }
}

export default Header;
