/******************** aureliuslib ********************/
/*****************************************************/
/* a set of functions intended to operate on a list  */
/* containing objects defined by the aurelius schema */
/*                                                   */
/* version: 1.0                                      */
/* date:    11/30/22                                 */
/* author:  Jenner Hanni                             */
/* license: GPLv3                                    */
/*****************************************************/

function getRandomToken(list, len) {
  let newId = [...Array(len)].map(() => Math.floor(Math.random() * len).toString(len)).join('')

  // if this id already exists, generate another
  if (list && list.length > 0) {
    let idsList = list.filter(node => node['core_props']['id'] === newId)
    if (idsList.length > 0) {
      newId = getRandomToken(list, len)
    }
  }
  return newId
}


function doesKeyExist(node, key) {
  return Object.keys().includes(key) ? true : false
}


function doesValTypeMatch(key, val) { 
  let keyType = key.slice(0,3)
  if (keyType === 'rel') { keyType = 'arr' }

  let valType = Object.prototype.toString.call(val).slice(8,11).toLowerCase()

  return keyType === valType
}


function getDateUpdatedObject(name) {
  return Math.floor(Date.now()/1000) + name
}


function getListOfRelNodeIds(sourceNode) {
  console.log('sourceNode', sourceNode)
  let listToReturn = []
  let keys = Object.keys(sourceNode['label_props'])
               .filter(key => key.slice(0,3) === 'rel')
  console.log('keys', keys)
  if (keys.length > 0) {
    for (let k=0; k < keys.length; k++) {
      let idList = sourceNode['label_props'][keys[k]]
      console.log('idList', idList)
      for (let i=0; i < idList.length; i++) {
        listToReturn.push(idList[i])
      }
    }
  }
  return listToReturn
}

function determineClickability(node, key) {
  let clickableKey = true
  let clickableVal = true

  if (node['core_props']['label'] === 'Label') {
    if (key === 'strLabel' || key === 'strLabelDescription') {
     clickableKey = false
    }
  } else {
   clickableKey = false
  }

  if (key === 'relRelatedNodes') {
    clickableKey = false
  }

  if (node['core_props']['label'] === 'Label' && key === 'strLabel') {
    clickableVal = false
  }

  return {'isClickableKey': clickableKey,
          'isClickableVal': clickableVal}
}


/*****************************************************/
/*************** top-level entry point ***************/
/*****************************************************/

export function crudList(op, options) {
  switch(op) {
    case 'HELP': 
      return renderHelp()

    case 'UTIL_DETERMINE_CLICKABILITY':
      return determineClickability(options["node"],
                                   options["key"])

    case 'UTIL_GET_RANDOM_TOKEN': 
      return getRandomToken(options["list"],
                            options["numChars"])
    case 'INIT_LABEL_OBJECT':
      return initLabelObject(options["list"],
                             options["user"])

    case 'INIT_LIST': 
      return initList(options["list"],
                      options["user"])

    case 'VALIDATE_NODE':
      return validateNode(options["list"],
                          options["user"],
                          options["nodeToValidate"],
                          options["fixNode"])

    case 'VALIDATE_LIST':
      return validateList(options["list"],
                          options["user"],
                          options["fixList"])

    case 'VALIDATE_UNIQUE_ID':
      return validateUniqueId(options["list"],
                              options["user"],
                              options["nodeId"],
                              options["fixUniqueness"])

    case 'GET_LIST_OF_LABELS':
      return getListOfLabels(options["list"],
                             options["returnType"])

    case 'GET_NODE_BY_KEYPAIR':
      return getNodesByKeyPair(options["list"],
                               options["user"],
                               options["keyset"],
                               options["key"],
                               options["val"],
                               options["returnType"],
                               options["firstOnly"],
                               options["labelToFilter"])

    case 'CREATE_NODE_FROM_LABEL': 
      return createNodeFromLabelObj(options["list"],
                                    options["user"],
                                    options["label"])

    case 'ADD_NODE': 
      return addNode(options["list"], 
                     options["user"],
                     options["nodeToAdd"])

    case 'REMOVE_NODE': 
      return removeNode(options["list"], 
                        options["user"],
                        options["idToRemove"])

    case 'UPDATE_CHANGE_ID': 
      return updateChangeNodeId(options["list"],
                                options["user"],
                                options["nodeToUpdate"],
                                options["oldId"],
                                options["newId"])

    case 'UPDATE_ADD_KEYPAIR': 
      return this.updateAddKeyPair(options["list"],
                                   options["user"],
                                   options["nodeToUpdate"],
                                   options["keyset"],
                                   options["keyToAdd"],
                                   options["valToAdd"])


    case 'UPDATE_REMOVE_KEYPAIR': 
      return this.updateRemoveKeyPair(options["list"],
                                      options["user"],
                                      options["nodeToUpdate"],
                                      options["keyset"],
                                      options["keyToRemove"])

    case 'UPDATE_RENAME_KEY': 
      return this.updateRenameKey(options["list"],
                                  options["user"],
                                  options["nodeToUpdate"],
                                  options["keyset"],
                                  options["oldKey"],
                                  options["newKey"])

    case 'UPDATE_CHANGE_VALUE': 
      return updateChangeVal(options["list"],
                             options["user"],
                             options["nodeToUpdate"],
                             options["key"],
                             options["newVal"])

    default:
      return null
  }
}


/*****************************************************/
/************************ help ***********************/
/*****************************************************/

function renderHelp() {
  return "this is a help string"
}

/*****************************************************/
/***************** init and validate *****************/
/*****************************************************/

function initLabelObject(list, user) {
  return {
    "core_props": {
      "id": getRandomToken(list, 16),
      "date_updated": [Math.floor(Date.now()/1000)+user],
      "label": "Label"
    },
    "label_props": {
      "strLabel": "Label",
      "strLabelDescription": "A capitalized single word...",
      "relRelatedNodes": []
    }
  }
}

function initList(list, user) {
  if (!user || user === '') {
    console.log('ERROR: USER_STR_INVALID', user)
    return []
  } 
  return [initLabelObject(list, user)]
}


function validateList(list, user, fixList) {
  let message = "INCOMPLETE"
  let fixedList = []

  // Does the list exist?
  // Does at least one original Label object exist?
  // Do all nodes in the list pass the validity check?
  // Are there any orphans?
     // return a list of their ids
  // Are there any duplicate ids?
     // if you fix, propagate to related nodes 
     // and report the changes
  // Generate a label node from a node's label_props
  // in case that label node does not exist

  return {"valid": false,
          "message": message,
          "fixedList": fixedList}
}

function validateNode(list, user, nodeToValidate, fixNode) {
  let message = "INCOMPLETE"
  let fixedNode = {}

  // Check that only the desired two keys are present
  let keys = Object.keys(nodeToValidate)
  if (keys.includes('core_props') && keys.includes('label_props') && keys.length === 2) {
    message = "SUCCESS"
  }

  // Check that all related node ids are valid ids
  // Check that all related nodes contain a backlink in one of their relProps
  // Check that all core_props keys and desired value types are as expected
  // Check that all label_props keys begin with 
  // Check that all label_props keys' prefixes correspond to the value types
  // CHeck that every node has a "relRelatedNodes" label_prop

  message = "INCOMPLETE"
  return {"valid": false,
          "message": message,
          "fixedNode": fixedNode}
}

function validateUniqueId(list, user, nodeId, fixUniqueness) {
  let message = "INCOMPLETE"
  let fixedList = []

  // get an array of indices of all matching objects
  let indices = list.map((node, idx) => node['core_props']['id'] === nodeId 
                                        ? idx 
                                        : null).filter(String);

  if (indices.length === 0) {
    console.log("ID NOT FOUND")
  } else if (indices.length > 1) {
    console.log("MULTIPLE IDS FOUND")
    console.log("if fixUniqueness is true, will attempt to fix and return fixed list")
  } else {
    console.log("NODE ID EXISTS AND IS UNIQUE")
  }

  return {"valid": false,
          "message": message,
          "fixedList": fixedList}

}

/*****************************************************/
/********************** reads ************************/
/*****************************************************/

function getListOfLabels(list, returnType) {
  list = list.filter(node => node['core_props']['label'] === 'Label')
  if (returnType === 'ids') {
    return list.map(node => node['core_props']['id'])
  } else if (returnType === 'strings') {
    return list.map(node => node['label_props']['strLabel'])
  } else {
    return list
  }
}


function getNodesByKeyPair(list, user, keyset, key, val,
                           returnType, firstOnly, labelToFilter) {

  console.log('getNodesByKeyPair', list, user, keyset, key, val,
                           returnType, firstOnly, labelToFilter)
  let listToReturn = []

  if (labelToFilter) {
    if (keyset === 'core_props' && key === 'date_updated') {
      // todo: return list of node ids
      listToReturn = list.filter(node => node['core_props']['label'] === labelToFilter)
    } else {
      listToReturn = list.filter(node => node['core_props']['label'] === labelToFilter
                                         && node[keyset][key] === val)
    }
  } else {
    if (keyset === 'core_props' && key === 'date_updated') {
      // todo: return list of node ids 
      listToReturn = list.filter(node => node['core_props']['label'] === labelToFilter)
    } else {
      listToReturn = list.filter(node => node[keyset][key] === val)
    }
  }

  if (returnType === 'objects') {
    if (firstOnly) {
      return [listToReturn[0]]
    } else {
      return listToReturn
    } 
  } else if (returnType === 'ids') {
    if (firstOnly) {
      return [listToReturn.map(node => node['core_props']['id'])[0]]
    } else {
      return listToReturn.map(node => node['core_props']['id'])
    }
  } else {
    console.log('ERROR_INVALID_RETURNTYPE')
    return []
  }
}


function createNodeFromLabelObj(list, user, label) {

  // find the label object for reference
  let newNode = getNodesByKeyPair(list, user, "label_props", "strLabel", 
				                  label, "objects", false, "Label")[0]

  console.log('newNode', newNode)
  newNode['core_props']['label'] = newNode['label_props']['strLabel']
  newNode['core_props']['date_updated']
    .push({"user": user,
           "timestamp": Date.now()/1000})
  if (label === 'Label') {
    newNode['label_props']['strLabel'] = ''
    newNode['label_props']['strLabelDescription'] = ''
  } else {
    delete newNode['label_props']['strLabel']
    delete newNode['label_props']['strLabelDescription']
  }

  return newNode
}


/*****************************************************/
/******************** add funcs **********************/
/*****************************************************/

function addNode(list, user, nodeToAdd) {
  console.log('addNode', list, user, nodeToAdd)
  let existingNodeList = getNodesByKeyPair(list, user, "core_props", "id", 
						                   nodeToAdd['core_props']['id'],
                                           "ids", true, null)
  if (!existingNodeList.length === 0) {
    console.log("ERROR_NOADD_OBJECTEXISTS")
    return []
  }
  nodeToAdd['core_props']['date_updated'].push(getDateUpdatedObject(user))
  list.push(nodeToAdd)
  list = enforceBidirectionalityAdd(list, user, nodeToAdd)

  return list
}


function enforceBidirectionalityAdd(list, user, nodeToAdd) {

  let relNodeIdsList = getListOfRelNodeIds(nodeToAdd)
  console.log('enforceBidirectionalityAdd', list, user, nodeToAdd, relNodeIdsList)

  // For every related node, add the source id to its relRelatedNodes property
  for (let i = 0; i < relNodeIdsList.length; i++) {
    let idToFind = relNodeIdsList[i]
    let idx = list.findIndex(node => node['core_props']['id'] === idToFind)
    list[idx] = addSourceIdToPropListOfIds(list[idx], user, nodeToAdd['core_props']['id'], 
				            "label_props", "relRelatedNodes") 
  }
  return list
}


function addSourceIdToPropListOfIds(targetObj, user, sourceId, targetKeyset, targetKey) {

  if (targetKey) {
    if (targetObj[targetKeyset][targetKey]) {
      targetObj[targetKeyset][targetKey].push(sourceId)
    } else {
      if (targetKey.slice(0,3) !== 'rel') {
        console.log("ERROR_INVALIDPREFIX")
        return "ERROR_INVALIDPREFIX"
      } else {
        targetObj[targetKeyset][targetKey] = [sourceId]
      }
    }

  } else {
    if (targetObj[targetKeyset]["relRelatedNodes"]) {
      targetObj[targetKeyset]["relRelatedNodes"]
        .push(sourceId)

    } else {
      targetObj[targetKeyset]["relRelatedNodes"] = [sourceId]
    }
  }
  targetObj['core_props']['date_updated'].push(getDateUpdatedObject(user))

  return targetObj
}


/*****************************************************/
/***************** update funcs **********************/ 
/*****************************************************/

function updateChangeNodeId(list, user, nodeToUpdate, oldId, newId) {
  console.log('updateChangeNodeId', list, user, nodeToUpdate, oldId, newId)

  let idx = list.findIndex(node => node['core_props']['id'] === oldId)

  if (idx < 0) {
    console.log("ERROR_NOUPDATE_OBJNOTFOUND")
    return []
  }
  let updatedNode = Object.assign({}, nodeToUpdate)
  updatedNode['core_props']['id'] = newId
  list[idx] = updatedNode
  list = enforceBidirectionalityChange(list, user, updatedNode)

  return list
}


function updateChangeVal(list, user, nodeToUpdate, key, newVal) {
  console.log('updateChangeVal', list, user, nodeToUpdate, key, newVal)
  let keyset = 'label_props'
  let idx = list.findIndex(node => node['core_props']['id'] === nodeToUpdate['core_props']['id'])
  if (idx <= 0) {
    console.log("ERROR_NOUPDATE_OBJNOTFOUND")
    return []
  }

  
  if (!key || !(key in nodeToUpdate[keyset])) {
    console.log("ERROR_KEYNOTFOUND")
    return "ERROR_KEYNOTFOUND"
  }

  let updatedNode = Object.assign({}, nodeToUpdate)
  updatedNode[keyset][key] = newVal
  list[idx] = updatedNode

  return list
}


function enforceBidirectionalityChange(list, user, nodeToChange, oldId, newId) {

  let relNodeIdsList = getListOfRelNodeIds(nodeToChange)

  // For every related node, change the old id into the new id in all relProps
  for (let i = 0; i < relNodeIdsList.length; i++) {
    let idToFind = relNodeIdsList[i]
    let idx = list.findIndex(node => node['core_props']['id'] === idToFind)
    list[idx] =  changeSourceIdInPropListOfIds(list[idx], user, oldId, newId, "label_props")
  }

  return list
}


function changeSourceIdInPropListOfIds(targetObj, user, oldSourceId, newSourceId, 
                                       targetKeyset, targetKey) {

  if (targetKey) {  
    if (targetObj[targetKeyset][targetKey]
	  && Array.isArray(targetObj[targetKeyset][targetKey])) {
     	    targetObj[targetKeyset][targetKey]
		.map(key => key === oldSourceId ? newSourceId : key)
    } else {
      if (targetKey.slice(0,3) !== 'rel') {
        console.log("ERROR_INVALIDKEYPREFIX")
        return "ERROR_INVALIDKEYPREFIX"
      } else {
        return "ERROR_KEYNOTFOUND"
      }
    }

  } else {
    // for every key in the targetKeyset, change the id
    let keys = Object.keys(targetObj[targetKeyset])
                     .filter(key => key.slice(0,3) === 'rel')
                     .filter(key => targetObj[targetKeyset][key].includes(oldSourceId))

    for (let key in keys) {
      targetObj[targetKeyset][keys[key]] = targetObj[targetKeyset][keys[key]]
        .map(i => i === oldSourceId ? newSourceId : i)
    }
  }
  targetObj['core_props']['date_updated'] = getDateUpdatedObject(user)

  return targetObj
}


/*****************************************************/
/***************** remove funcs **********************/
/*****************************************************/

function removeNode(list, user, idToRemove) {
  let nodeToRemove = getNodesByKeyPair(list, user, "core_props", "id", idToRemove, 
   			      	                   "ids", true, null)
  if (nodeToRemove.length === 0) {
    console.log("ERROR_NOREMOVE_OBJNOTFOUND")
    return []
  } else if (nodeToRemove.length > 1) {
    console.log("ERROR_NOREMOVE_DUPEOBJECTSFOUND")
    return []
  }
  nodeToRemove = nodeToRemove[0]
  list = enforceBidirectionalityRemove(list, user, nodeToRemove)
  list = list.filter(node => node['core_props']['id'] === idToRemove)

  return list
}


function enforceBidirectionalityRemove(list, user, nodeToRemove) {

  let relNodeIdsList = getListOfRelNodeIds(nodeToRemove)

  // For every related node, remove the source id from all relProps
  for (let i = 0; i < relNodeIdsList.length; i++) {
    let idToFind = relNodeIdsList[i]
    let idx = list.findIndex(node => node['core_props']['id'] === idToFind)
    let idToRemove = nodeToRemove['core_props']['id']
    list[idx] = removeSourceIdFromPropListOfIds(list[idx], user, idToRemove, "label_props")
  }

  return list
}


function removeSourceIdFromPropListOfIds(targetObj, user, sourceId, targetKeyset, targetKey) {
   if (targetKey) {
    if (targetObj[targetKeyset][targetKey]) {
      targetObj[targetKeyset][targetKey] =
        targetObj[targetKeyset][targetKey]
          .filter(i => i !== sourceId)
    } else {
      console.log("ERROR_KEYNOTFOUND")
      return "ERROR_KEYNOTFOUND"
    }

  } else {
    let keys = Object.keys(targetObj[targetKeyset])
                 .filter(key => key.slice(0,3) === 'rel')
                 .filter(key => targetObj[targetKeyset][key].includes(sourceId))

    for (let key in keys) {
      targetObj[targetKeyset][keys[key]] = targetObj[targetKeyset][keys[key]]
        .filter(i => i !== sourceId)
    }
  }
  targetObj['core_props']['date_updated'].push(getDateUpdatedObject(user))

  return targetObj
}


