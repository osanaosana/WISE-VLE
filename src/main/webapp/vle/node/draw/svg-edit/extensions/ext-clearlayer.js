/*
 * ext-clearlayer.js
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2013 Jonathan Lim-Breitbart
 * 
 * Adds a button to clear (delete all drawings elements on) the current layer
 * TODO: i18n
 */
 
svgEditor.addExtension("CLear Layer", function() {
	
	var revertWarning = '<div id="revert_dialog"><div class="ui-state-error">' +
		//'<span class="ui-icon ui-icon-alert" style="float:left"></span>' +
		//'Warning! This will erase your current drawing.' +
		'<span class="ui-icon ui-icon-alert" style="float:left"></span>' + // edited text for WISE4
		'Warning! This will erase your current drawing and replace it with the default state.' +
		'</div><div class="ui-dialog-content-content"><p>If you would like to continue, press "OK".</p>' +
		'</div></div>';
	$('#svg_editor').append(revertWarning);
	
	$('#revert_dialog').dialog({
		title: 'Erase Drawing',
		resizable: false,
		modal: true,
		autoOpen: false,
		width: 560,
		buttons: [
		    {
		    	text: 'OK',
		    	click: function() {
		    		// delete all elements in the student layer
		    		// TODO: Eventually allow foreground (editable) starting drawings as well (WISE4)
	    			svgCanvas.selectAllInCurrentLayer();
		    		svgCanvas.deleteSelectedElements();
		    		$(this).dialog('close');
				}
		    },
			{
		    	text: 'Cancel',
		    	click: function() {	$(this).dialog('close'); }
		    }
		]
	});

	return {
		name: "Clear Layer",
		//svgicons: "extensions/clearlayer-icon.xml", // TODO: create and add
		buttons: [{
            id: "tool_erase",
            type: "context",
            panel: "editor_panel",
            //title: "Clear Current Layer",
            title: "Erase Current Drawing", // edited for WISE4
            icon: 'images/erase.png',
            events: {
                'click': function() {
                    $('#revert_dialog').dialog('open');
                }
            }
		}]
	};
});

