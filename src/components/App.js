import React, { Component } from 'react';
import './App.css';

import GraphletJS from '@wallowadigitalexhibits/graphletjs'

import Header from './Header.js'

import DashboardView from './views/DashboardView.js'
import AdminView from './views/AdminView.js'
import ArchivistView from './views/ArchivistView.js'
import InstructionsView from './views/InstructionsView.js'
import ProgrammerView from './views/ProgrammerView.js'
import ResearcherView from './views/ResearcherView.js'

import AdminLoginModal from './modals/AdminLoginModal.js'
import ArchivistLoginModal from './modals/ArchivistLoginModal.js'
import InitialConfigModal from './modals/InitialConfigModal.js'
import CreateNodeModal from './modals/CreateNodeModal.js'

import ItemNode from './nodes/ItemNode.js'
import ItemAcquisitionRecordNode from './nodes/ItemAcquisitionRecordNode.js'
import KeywordNode from './nodes/KeywordNode.js'
import ListNode from './nodes/ListNode.js'
import UserNode from './nodes/UserNode.js'

import FilteredList from './elements/FilteredList'

const { ipcRenderer } = window.require('electron')

let graphlet = new GraphletJS().crudList;
graphlet('HELP')

class App extends Component {

  /****************************************************/
  /*********************** state **********************/
  /****************************************************/

  constructor(props) {
    super(props);

    this.state = {
      app_dir: '',

      user: 'admin',

      config_loaded: false,
      config: {},

      data_loaded: false,
      data: [],

      view: 'dashboard',
      researcher_view: '',

      which_archivist_user: {},
      which_obj: {},

      show_initial_config_modal: false,
      show_archivist_login_modal: false,
      show_create_node_modal: false,
      show_admin_login_modal: false
    };
  }


  /****************************************************/
  /** initial config load + ipc handler registration **/
  /****************************************************/

  componentDidMount() {
    this.getConfig()
    this.getAppDir()

    ipcRenderer.on('got-appdir', function(event, message) {
      this.receiveAppDir(message)
    }.bind(this))

    ipcRenderer.on('got-config', function(event, message) {
      this.receiveGotConfig(message)
    }.bind(this))

    ipcRenderer.on('config-set', function(event, message) {
      this.receiveConfigSet(message)
    }.bind(this))

    ipcRenderer.on('got-db', function(event, message) {
      this.receiveGotDb(message)
    }.bind(this))

    ipcRenderer.on('db-set', function(event, message) {
      this.receiveDbSet(message)
    }.bind(this))

    ipcRenderer.on('manual-backup-complete', function(event, message) {
      this.receiveManualBackupComplete(message)
    }.bind(this))

    ipcRenderer.on('site-deployed', function(event, message) {
      this.receiveSiteDeployed(message)
    }.bind(this))

    document.addEventListener('keydown', this.handleGlobalKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleGlobalKey);
  }

  /****************************************************/
  /*************** global hotkey handler **************/
  /****************************************************/

  handleGlobalKey = (e) => {
    //console.log('handleGlobalKey', e.key);
    if (e.key === 'Escape') {
      e.preventDefault();
      this.setState({ show_initial_config_modal: false,
                      show_archivist_login_modal: false,
                      show_create_node_modal: false,
                      show_admin_login_modal: false })
    } else if (e.key === 'n' && e.ctrlKey) {
      e.preventDefault();
      this.setState({ show_create_node_modal: true })
    } else if (e.key === 'h' && e.ctrlKey) {
      e.preventDefault();
      this.setState({ show_initial_config_modal: false,
                      show_archivist_login_modal: false,
                      show_create_node_modal: false,
                      show_admin_login_modal: false })
      this.setView('dashboard')
    }
  }

  /****************************************************/
  /************* state handler functions **************/
  /****************************************************/

  setView = (viewStr) => {
    this.setState({ view: viewStr,
                    researcher_view: '',
                    which_archivist_user: {} })
  }

  setWhichObjById = (newObjId) => {
    let options = { 'list': this.state.data.slice(),
                    'user': this.state.user,
                    'keyset': 'core_props',
                    'key': 'id',
                    'val': newObjId,
                    'returnType': 'objects',
                    'firstOnly': false,
                    'labelToFilter': 'Item'}

    let newObj = graphlet('GET_NODE_BY_KEYPAIR', options)
    this.setWhichObj(newObj[0])
  }

  setWhichObj = (newObj) => {
    this.setState({ which_obj: newObj })
  }

  setResearcherView = (e, researcherViewStr) => {
    console.log('researcherViewStr', researcherViewStr)
    this.setState({ researcher_view: researcherViewStr })
  }

  setArchivistLoginModal = (boolShow) => {
    this.setState({ show_archivist_login_modal: boolShow })
  }

  setArchiveViewWithUser = (e, userObj) => {
    this.setState({ show_archivist_login_modal: false,
                    which_archivist_user: userObj,
                    view: 'archivist' })
  }

  setAdminLoginModal = (boolShow) => {
    this.setState({ show_admin_login_modal: boolShow })
  }

  setAdminViewWithUser = (e, userObj) => {
    this.setState({ show_archivist_login_modal: false,
                    which_archivist_user: userObj,
                    view: 'archivist' })
  }

  setCreateNodeModal = (showModal, newNodeObj) => {
    if (newNodeObj) {
      this.setState({ show_create_node_modal: showModal,
                      which_obj: newNodeObj })
    } else {
      this.setState({ show_create_node_modal: showModal })
    }
  }

  setInitialConfigModalInState = (val) => {
    this.setState({ show_initial_config_modal: val })
  }

  /****************************************************/
  /*********** get/set handler functions **************/
  /****************************************************/

  /** config get/set handlers */

  getConfig = () => {
    ipcRenderer.send('get-config');
  }

  receiveGotConfig = (message) => {
    console.log('got-config', message)
    if (message['status'] === 'SUCCESS') {
      if (this.checkIfAllPathsAreSet(message['payload']['paths'])) {
        this.setState({ config: message['payload'],
                        config_loaded: true })
        this.getDb()

      } else {
        this.setState({ config: message['payload'],
                        config_loaded: true,
                        show_initial_config_modal: true })
      }

    } else {
      console.log('got-config ERROR not received correctly', message['status'])
    }
  }

  setConfig = (newConfigObj) => {
    console.log('setConfig', newConfigObj)
    ipcRenderer.send('set-config', newConfigObj)
  }

  receiveConfigSet = (message) => {
    console.log('got-config', message)
    if (!message['status'] === 'SUCCESS') {
      console.log('got-config ERROR not received correctly', message['status'])
    }
  }

  /** db get/set handlers **/

  getDb = () => {
    ipcRenderer.send('get-db');
  }

  receiveGotDb = (message) => {
    console.log('got-db', message)

    switch(message['status']) {
      case 'ERROR_NO_DATABASE_PATH_GIVEN':
        console.log('ERROR_NO_DATABASE_PATH_GIVEN')
        // TODO: DO THIS NEXT
        this.setState({ show_initial_config_modal: true })
        break
      case 'FAILURE_SEE_ERROR':
        console.log('FAILURE_SEE_ERROR')
        break
      case 'SUCCESS':
      default:
        console.log('SUCCESS')
        this.setState({ data: message['payload'],
                        data_loaded: true })
}
    console.log('message', message)
  }

  setDb = (newDbObj) => {
    ipcRenderer.send('set-db', JSON.stringify(newDbObj, null, 2));
  }

  receiveDbSet = (message) => {
    console.log('db-set', message)
  }

  /** other get/set handlers **/

  getAppDir = (e) => {
    if (e) {e.preventDefault()}
    console.log('getAppDir')
    ipcRenderer.send('get-appdir')
  }

  receiveAppDir = (message) => {
    console.log('receiveAppDir', message)
    this.setState({ app_dir: message['status'] === 'SUCCESS' ? message['payload'] : 'ERROR' })
  }

  runBackup = (e) => {
    e.preventDefault()
    console.log('runBackup')
    ipcRenderer.send('run-manual-backup')
  }

  receiveManualBackupComplete = (message) => {
    console.log('receiveManualBackupComplete', message)
  }

  deploySite = (e) => {
    e.preventDefault()
    console.log('deploySite')
    ipcRenderer.send('deploy-site')
  }

  receiveSiteDeployed = (message) => {
    console.log('receiveSiteDeployed', message)
  }

  /****************************************************/
  /************* data helper functions ****************/
  /****************************************************/

  updateConfigInStateAndDb = (newConfigObj) => {
    this.setState({ config: newConfigObj })
    this.setConfig(newConfigObj)
  }

  updateDbInStateAndDb = (newDbObj) => {
    this.setState({ data: newDbObj})

    //this.setDb(newDbObj)
  }

  checkIfAllPathsAreSet = (pathsObj) => {
    console.log('checkIfAllPathsAreSet', pathsObj)
    let p = (Object.values(pathsObj)
              .some((path) => path['val'] === ''))
    return !p
  }

  /****************************************************/
  /************* render helper functions **************/
  /****************************************************/

  renderNode = (node, layout) => {

    // if node var is a string, assume it is an id
    if (typeof(node) === 'string') {
      let options = { 'list': this.state.data.slice(),
                      'user': this.state.user,
                      'keyset': 'core_props',
                      'key': 'id',
                      'val': node,
                      'returnType': 'objects',
                      'firstOnly': false,
                      'labelToFilter': 'Item'}

      node = graphlet('GET_NODE_BY_KEYPAIR', options)[0]
    }

    console.log(node)
    let label = node['core_props']['label']
    switch (label) {
      case 'Item':
        return (<ItemNode key={node['core_props']['id']}
                          node={node}
                          layout={layout}
                          setWhichObj={this.setWhichObj}
                          renderNode={this.renderNode} />)
      case 'ItemAcquisitionRecord':
        return (<ItemAcquisitionRecordNode key={node['core_props']['id']}
                                           node={node}
                                           layout={layout}
                                           setWhichObj={this.setWhichObj}
                                           renderNode={this.renderNode} />)
      case 'Keyword':
        return (<KeywordNode key={node['core_props']['id']}
                             node={node}
                             layout={layout}
                             setWhichObj={this.setWhichObj}
                             setWhichObjById={this.setWhichObjById}
                             renderNode={this.renderNode} />)
      case 'List':
        return (<ListNode key={node['core_props']['id']}
                          node={node}
                          layout={layout}
                          setWhichObj={this.setWhichObj}
                          renderNode={this.renderNode} />)
      case 'User':
        return (<UserNode key={node['core_props']['id']}
                          node={node}
                          layout={layout}
                          setWhichObj={this.setWhichObj}
                          renderNode={this.renderNode} />)
      default:
        return 'Error'
    }
  }

  // TODO Actually render a helpful modal or something
  renderOrgName = () => {
    if (this.state.config && this.state.config['org']['org_name']) {
      return this.state['admin']
    } else {
      return ''
    }
  }

  renderFilteredList = (payload, defaultValue, radioOptions, resultHandlerFunc) => {
    return <FilteredList payload={payload}
                         defaultValue={defaultValue}
                         radioOptions={radioOptions.filter(option => option !== "Label")}
                         resultHandlerFunc={resultHandlerFunc} />
  }

  /****************************************************/
  /***************** render functions *****************/
  /****************************************************/

  renderView = () => {
    switch(this.state.view) {
      case 'admin':
        return(<div>
                 <Header setView={this.setView}
                         view={this.state.view} />
                 <AdminView config={this.state.config}
                            deploySite={this.deploySite}
                            runBackup={this.runBackup}
                            updateConfigInStateAndDb={this.updateConfigInStateAndDb} />
               </div>)
      case 'archivist':
        return(<div>
                 <Header setView={this.setView}
                         view={this.state.view}
                         user={this.state.which_archivist_user} />
                 <ArchivistView user={this.state.which_archivist_user} />
               </div>)
      case 'instructions':
        return(<div>
                 <Header setView={this.setView}
                         view={this.state.view} />
                 <InstructionsView />
               </div>)
      case 'programmer':
        return(<div>
                 <Header setView={this.setView}
                         view={this.state.view} />
                 <ProgrammerView />
               </div>)
      case 'researcher':
        return(<div>
                 <Header setView={this.setView}
                         view={this.state.view}
                         setResearcherView={this.setResearcherView} />
                 <ResearcherView researcher_view={this.state.researcher_view}
                                 which_obj={this.state.which_obj}
                                 nodes={this.state.data
                                          .filter(node => node['core_props']['label'] === 'Keyword' ||
                                                          node['core_props']['label'] === 'Item')}
                                 setWhichObj={this.setWhichObj}
                                 renderNode={this.renderNode} />
               </div>)

      case 'dashboard':
      default:
        return(<DashboardView config={this.state.config}
                              app_dir={this.state.app_dir}
                              data_loaded={this.state.data_loaded}
                              setView={this.setView}
                              setArchivistLoginModal={this.setArchivistLoginModal} />)

    }
  }

  renderArchivistLoginModal = () => {
    if (this.state.show_archivist_login_modal) {
      return <ArchivistLoginModal users={this.state.data
                                          .filter(node => node['core_props']['label'] === 'User')}
                                  setArchiveViewWithUser={this.setArchiveViewWithUser}/>
    } else {
      return null
    }
  }

  renderAdminLoginModal = () => {
    if (this.state.show_admin_login_modal) {
      return <AdminLoginModal users={this.state.data
                                      .filter(node => node['core_props']['label'] === 'User')}
                              setArchiveViewWithUser={this.setArchiveViewWithUser}/>
    } else {
      return null
    }
  }

  renderInitialConfigModal = () => {
    if (this.state.show_initial_config_modal) {
      return <InitialConfigModal config={this.state.config}
                                 app_dir={this.state.app_dir}
                                 checkIfAllPathsAreSet={this.checkIfAllPathsAreSet}
                                 updateConfigInStateAndDb={this.updateConfigInStateAndDb}
                                 setInitialConfigModalInState={this.setInitialConfigModalInState} />
    } else {
      return null
    }
  }

  renderCreateNodeModal = () => {
    if (this.state.show_create_node_modal) {
      return <CreateNodeModal nodes={this.state.data}
                              user={this.state.user}
                              payload={{}}
                              graphlet={graphlet}
                              updateDbInStateAndDb={this.updateDbInStateAndDb}
                              setCreateNodeModal={this.setCreateNodeModal}
                              renderFilteredList={this.renderFilteredList} />
    } else {
      return null
    }
  }

  /************/
  /** Render **/
  /************/

  render() {
    return(<div className="app">
             {this.renderInitialConfigModal()}
             {this.renderArchivistLoginModal()}
             {this.renderAdminLoginModal()}
             {this.renderCreateNodeModal()}

             {this.renderView()}
           </div>)
  }

}

export default App;
