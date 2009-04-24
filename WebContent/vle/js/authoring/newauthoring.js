/*****											    *****|
 * The following functions are used by YUI for the drag *|
 * and drop stuff on this page						    *|
 *****											    *****/
function generateDD(){
	//clear previous list of draggable elements
	ddList = [];
	targetsList = [];
	
	YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {
	    //Listen for all drop:over events
	    Y.DD.DDM.on('drop:over', function(e) {
	    	
	       //Get a reference to out drag and drop nodes
	        var drag = e.drag.get('node'),
	            drop = e.drop.get('node');
	        
	        //Are we dropping on a li node?
	        if (drop.get('tagName').toLowerCase() === 'li') {
	            //Are we not going up?
	            if (!goingUp) {
	               drop = drop.get('nextSibling');
	            }
	            //Add the node to this list
	            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
	            //Resize this nodes shim, so we can drop on it later.
	            e.drop.sizeShim();
	        }
	    });
	    //Listen for all drag:drag events
	    Y.DD.DDM.on('drag:drag', function(e) {
	        //Get the last y point
	        var y = e.target.lastXY[1];
	        //is it greater than the lastY var?
	        if (y < lastY) {
	            //We are going up
	            goingUp = true;
	        } else {
	            //We are going down..
	            goingUp = false;
	        }
	        //Cache for next check
	        lastY = y;
	    });
	    //Listen for all drag:start events
	    Y.DD.DDM.on('drag:start', function(e) {
	        //Get our drag object
	        var drag = e.target;
	        //Set some styles here
	        drag.get('node').setStyle('opacity', '.25');
	        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
	        drag.get('dragNode').setStyles({
	            opacity: '.5',
	            borderColor: drag.get('node').getStyle('borderColor'),
	            backgroundColor: drag.get('node').getStyle('backgroundColor')
	        });
	    });
	    //Listen for a drag:end events
	    Y.DD.DDM.on('drag:end', function(e) {
	        var drag = e.target;
	        //Put out styles back
	        drag.get('node').setStyles({
	            visibility: '',
	            opacity: '1'
	        });
	        //authoringTool.onNodeDropped(drag);
	    });
	    //Listen for all drag:drophit events
	    Y.DD.DDM.on('drag:drophit', function(e) {
	        var drop = e.drop.get('node'),
	            drag = e.drag.get('node');
			
	        //if we are not on an li, we must have been dropped on a ul
	        if (drop.get('tagName').toLowerCase() !== 'li') {
	            if (!drop.contains(drag)) {
	                drop.appendChild(drag);
	            }
	            onNodeDropped(drag, drop);
	        }
	    });
	    
	    //Static Vars
	    var goingUp = false, lastY = 0;
	
	    //Get the list of li's with class draggable in the lists and make them draggable
		var lis = Y.Node.all('#ddTable tr ul li.draggable');
	    if (lis != null) {
	    	lis.each(function(v, k) {
	    		var dd = new Y.DD.Drag({
	    			node: v,
	    			proxy: true,
	    			moveOnEnd: false,
	    			groups: ['sequence', 'trash'],
	    			target: {
	    			padding: '0 0 0 20'
	    		}
	    		});
	    		ddList.push(dd);
	    	});
	    }
	    
	    //reference nodes in a sequence
	    var lis = Y.Node.all('#ddTable tr ul li ul li.draggable');
	    if(lis != null){
	    	lis.each(function(v, k) {
	    		var dd = new Y.DD.Drag({
	    			node: v,
	    			proxy: true,
	    			moveOnEnd: false,
	    			groups: ['sequence', 'trash'],
	    			target: {
	    			padding: '0 0 0 20'
	    		}
	    		});
	    		ddList.push(dd);
	    	});
	    }
	    
	    var targets = document.getElementsByName('sequenceContainer');
	    for(var f=0;f<targets.length;f++){
	    	createSequenceTargets(Y, targets[f]);
	    };
	    
	    createTrashTarget(Y);
	});
};

function createSequenceTargets(Y, el){
	var tar = new Y.DD.Drop({node: el, groups: ['sequence']});
	targetsList.push(tar);
};

function createTrashTarget(Y){
	var tar = new Y.DD.Drop({node: document.getElementById('trash'), groups: ['trash']});
	targetsList.push(tar);
};

function removeDragged(el){
	var nodeId = el.get('id');
	var docEl = document.getElementById(nodeId);
	var parent = docEl.parentNode;
	
	parent.removeChild(docEl);
	project.removeNodeById(nodeId);
};

function removeReferencedNode(el){
	var nodeId = el.get('id');
	var docEl = document.getElementById(nodeId);
	var parent = docEl.parentNode;
	var parentChildIds = nodeId.split('|');
	
	parent.removeChild(docEl);
	project.removeReferenceFromSequence(parentChildIds[0], parentChildIds[1]);
};

function onNodeDropped(dragged, dropped){
	if(dropped.get('id')=='trash'){
		if(document.getElementById(dragged.get('id')).getAttribute('name')=='ref-node'){
			removeReferencedNode(dragged);
		} else {
			removeDragged(dragged);
		};
	};
	populateSequences();
	populateNodes();
	generateDD();
};
/*****												******|
 * End functions used by YUI for the drag and drop stuff *|
 *****												******/