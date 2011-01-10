var coreScripts = [
	'vle/node/multiplechoice/MultipleChoiceNode.js',
	'vle/node/multiplechoice/ChallengeNode.js',
	'vle/node/multiplechoice/multipleChoiceEvents.js'
];

var studentVLEScripts = [
	'vle/node/common/nodehelpers.js',
	'vle/common/helperfunctions.js',
	'vle/jquery/js/jquery-1.4.2.min.js',
	'vle/jquery/js/jquery-ui-1.8.custom.min.js',
	'vle/jquery/js/jsonplugin.js',
	'vle/node/multiplechoice/multiplechoicestate.js',
	'vle/node/multiplechoice/challengestate.js',
	'vle/node/multiplechoice/branchstate.js',
	'vle/node/multiplechoice/mc.js'
];

var authorScripts = [
	'vle/node/multiplechoice/authorview_multiplechoice.js'
];

var gradingScripts = [
	'vle/node/multiplechoice/multiplechoicestate.js',
	'vle/node/multiplechoice/challengestate.js',
    'vle/node/multiplechoice/branchstate.js'
];

var dependencies = [
	{child:"vle/node/multiplechoice/MultipleChoiceNode.js", parent:["vle/node/Node.js"]},
	{child:'vle/node/multiplechoice/ChallengeNode.js', parent:['vle/node/Node.js','vle/node/multiplechoice/MultipleChoiceNode.js']}
];

var css = [
	"vle/node/common/css/htmlAssessment.css",
	"vle/node/multiplechoice/mcstyles.css"
];

scriptloader.addScriptToComponent('core', coreScripts);
scriptloader.addScriptToComponent('multiplechoice', studentVLEScripts);
scriptloader.addScriptToComponent('author', authorScripts);
scriptloader.addScriptToComponent('studentwork', gradingScripts);
scriptloader.addDependencies(dependencies);
scriptloader.addCssToComponent('multiplechoice', css);

scriptloader.addCssToComponent('author', 'vle/css/authoring/author_multiplechoice.css');

//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	eventManager.fire('scriptLoaded', 'vle/node/multiplechoice/setup.js');
};