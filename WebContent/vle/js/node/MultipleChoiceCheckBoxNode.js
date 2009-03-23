/*
 * MultipleChoiceCheckBoxNode
 */

MultipleChoiceCheckBoxNode.prototype = new Node();
MultipleChoiceCheckBoxNode.prototype.constructor = MultipleChoiceCheckBoxNode;
MultipleChoiceCheckBoxNode.prototype.parent = Node.prototype;
function MultipleChoiceCheckBoxNode(nodeType) {
	this.type = nodeType;
}

MultipleChoiceCheckBoxNode.prototype.render = function(contentPanel) {
	if(contentPanel == null) {
		window.frames["ifrm"].location = "js/node/multiplechoicecheckbox/multiplechoicecheckbox.html";
	} else {
		contentPanel.location = "js/node/multiplechoicecheckbox/multiplechoicecheckbox.html";
	}
}



MultipleChoiceCheckBoxNode.prototype.load = function() {
	var xmlNode = this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	window.frames["ifrm"].renderMCFromString(xmlNode);
	
	//these steps are now loaded from the vle/otml, this does not work for some reason
	window.frames["ifrm"].loadFromVLE(this, vle);
	
	document.getElementById('topStepTitle').innerHTML = this.title;
}

/**
 * @return an xml string that represents the current state of this
 * node which includes the student's submitted data
 */
MultipleChoiceCheckBoxNode.prototype.getDataXML = function(nodeStates) {
	return MultipleChoiceCheckBoxNode.prototype.parent.getDataXML(nodeStates);
}

/**
 * 
 * @param nodeStatesXML xml nodeStates object that contains xml state objects
 * @return an array populated with state object instances
 */
MultipleChoiceCheckBoxNode.prototype.parseDataXML = function(nodeStatesXML) {
	var statesXML = nodeStatesXML.getElementsByTagName("state");
	var statesArrayObject = new Array();
	for(var x=0; x<statesXML.length; x++) {
		var stateXML = statesXML[x];
		
		/*
		 * parse an individual stateXML object to create an actual instance
		 * of an MCSTATE object and put it into the array that we will return
		 */
		var stateObject = MCCBSTATE.prototype.parseDataXML(stateXML);
		
		if(stateObject != null) {
			statesArrayObject.push(stateObject);
		}
	}
	
	return statesArrayObject;
}

/**
 * 
 * @return an XML MultipleChoiceCheckBoxNode string that includes 
 * the content of the node. this is for authoring when we want to 
 * convert the project back from the authored object into an xml  
 * representation for saving.
 */
MultipleChoiceCheckBoxNode.prototype.exportNode = function() {
	var exportXML = "";
	
	exportXML += this.exportNodeHeader();
	
	exportXML += "<jaxbXML><![CDATA[";
	exportXML += this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue;
	exportXML += "]]></jaxbXML>";
	
	exportXML += this.exportNodeFooter();
	
	return exportXML;
}

/**
 * Retrieves the latest student work for this node and returns it in
 * a query entry object
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceCheckBoxQueryEntry that contains the latest student
 * 		work for this node. return null if this student has not accessed
 * 		this step yet.
 */
MultipleChoiceCheckBoxNode.prototype.getLatestWork = function(vle, dataId) {
	var latestState = null;
	
	//setup the mc object by loading in the content of the step
	this.mccb = new MC_CHECKBOX(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mccb object
	this.mccb.loadForTicker(this, vle);
	
	//get the most recent student work for this step
	latestState = this.mccb.getLatestState(this.id);
	
	if(latestState == null) {
		//the student has not accessed or completed this step yet
		return null;
	}
	
	/*
	 * an array that contains the choices this student chose
	 * (key, value) = (choiceId, choiceValue)
	 */
	var choiceIdToValue = new Array();
	for(var x=0; x<latestState.choices.length; x++) {
		choiceIdToValue[latestState.choices[x]] = this.mccb.getCHOICEByIdentifier(latestState.choices[x]).text;
	}

	//create and return a query entry object
	return new MultipleChoiceCheckBoxQueryEntry(dataId, this.id, this.mccb.promptText, choiceIdToValue);
}

/**
 * Create a query container that will contain all the query entries
 * @param vle the vle that this node has been loaded into, this vle
 * 		is related to a specific student, so all the work in this vle
 * 		is for just one student
 * @return a MultipleChoiceCheckBoxQueryContainer that will contain all the
 * 		query entries for a specific nodeId as well as accumulated 
 * 		metadata about all those entries such as count totals, etc.
 */
MultipleChoiceCheckBoxNode.prototype.makeQueryContainer = function(vle) {
	//setup the mccb object by loading in the content of the step
	this.mccb = new MC_CHECKBOX(loadXMLString(this.element.getElementsByTagName("jaxbXML")[0].firstChild.nodeValue));
	
	//load the states from the vle into the mc object
	this.mccb.loadForTicker(this, vle);
	
	//create and return a query container object
	return new MultipleChoiceCheckBoxQueryContainer(this.id, this.mccb.promptText, this.mccb.choiceToValueArray);
}