FillinNode.prototype=new Node;FillinNode.prototype.constructor=FillinNode;FillinNode.prototype.parent=Node.prototype;FillinNode.authoringToolName="Fill In";FillinNode.authoringToolDescription="Students fill in the missing text blanks in a body of text";function FillinNode(a,b){this.view=b;this.type=a;this.prevWorkNodeIds=[]}FillinNode.prototype.parseDataJSONObj=function(a){return FILLINSTATE.prototype.parseDataJSONObj(a)};FillinNode.prototype.translateStudentWork=function(a){return a};
FillinNode.prototype.getHTMLContentTemplate=function(){return createContent("node/fillin/fillin.html")};NodeFactory.addNode("FillinNode",FillinNode);typeof eventManager!="undefined"&&eventManager.fire("scriptLoaded","vle/node/fillin/FillinNode.js");View.prototype.fillinDispatcher=function(a,b,c){a=="fillinTextUpdated"?c.FillinNode.fillinTextUpdated():a=="fillinCreateFillin"?c.FillinNode.createFillin():a=="fillinRemoveFillin"?c.FillinNode.removeFillin():a=="fillinClick"?c.FillinNode.fillinClick(b[0],b[1]):a=="fillinChangeSelected"?c.FillinNode.changeSelected(b[0]):a=="fillinAddNewAllowable"?c.FillinNode.addNewAllowable(b[0]):a=="fillinEntryChanged"?c.FillinNode.entryChanged(b[0]):a=="fillinRemoveAllowable"&&c.FillinNode.removeAllowable(b[0],
b[1])};for(var events=["fillinTextUpdated","fillinCreateFillin","fillinRemoveFillin","fillinClick","fillinChangeSelected","fillinAddNewAllowable","fillinEntryChanged","fillinRemoveAllowable"],x=0;x<events.length;x++)componentloader.addEvent(events[x],"fillinDispatcher");typeof eventManager!="undefined"&&eventManager.fire("scriptLoaded","vle/node/fillin/fillinEvents.js");
if(typeof eventManager != 'undefined'){eventManager.fire('scriptLoaded', 'vle/node/fillin/fillin_core_min.js');}