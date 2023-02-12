import React, { Component } from 'react'

import { ReactComponent as AdminIcon } from '../../icons/admin.svg';
import { ReactComponent as ArchivistIcon } from '../../icons/archivist.svg';
import { ReactComponent as InstructionsIcon } from '../../icons/instructions.svg';
//import { ReactComponent as ProgrammerIcon } from '../../icons/programmer.svg';
import { ReactComponent as ResearcherIcon } from '../../icons/researcher.svg';

class DashboardView extends Component {

  render() {

    if (!this.props.data_loaded) {
      return( <div className="dashboard__wrapper">
                <h1 className="dashboard__title">
                  Archive App
                </h1>
                <div className="dashboard__subtitle">
                  There's a problem loading the database file...<br />
                  Please close the application and edit <br />
                  {this.props.app_dir}<br />
                  and start over.
                </div>
              </div>)

    } else {
      return(<div className="dashboard__wrapper">
              <h1 className="dashboard__title">
                Archive App
              </h1>
            
              <div className="dashboard__subtitle">
                {this.props.config['org']
                  ? this.props.config['org']['org_name']['val'] 
                  : null}
              </div>
              <div className="dashboard__icons">
                <div className="dashboard__icon"
                      onClick={(e)=>this.props.setView('researcher')}>
                  <ResearcherIcon className="dashboard__icon" />
                  <p className="dashboard__icon-title">Researcher</p>
                </div>
                <div className="dashboard__icon"
                      onClick={(e)=>this.props.setArchivistLoginModal(true)}>
                  <ArchivistIcon className="dashboard__icon" />
                  <p className="dashboard__icon-title">Archivist</p>
                </div>
                <div className="dashboard__icon"
                      onClick={(e)=>this.props.setView('admin')}>
                  <AdminIcon className="dashboard__icon" />
                  <p className="dashboard__icon-title">Administrator</p>
                </div>
                <div className="dashboard__icon"
                      onClick={(e)=>this.props.setView('instructions')}>
                  <InstructionsIcon className="dashboard__icon" />
                  <p className="dashboard__icon-title">Instructions</p>
                </div>
              </div>
            </div>)
    }
  }
}

export default DashboardView;
