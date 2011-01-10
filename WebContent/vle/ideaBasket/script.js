/* Author: 
* Jonathan Breitbart
*/
	
var basket; // global variable so it can be accessed by other functions
//localStorage.clear();
$(document).ready(function() {
	if (typeof(localStorage) == 'undefined' ) {
		alert('Your browser does not support HTML5 localStorage. Try upgrading to Firefox 3.5+, Chrome 4+, Internet Explorer 8+, or Safari 4+.');
		$('#ideasEmpty').text('Please upgrade your browser.')
	} else {
		if(basket == null){
			basket = new IdeaBasket();
		}
		
		$('#showAdmin').click(function(){
			$('#adminLinks').toggle();
		});
		
		$("#ideaForm").validate();
		
		$('#source').change(function(){
			if($('#source').val()=='Other'){
				$('#otherSource').show();
				$('#other').addClass('required');
			} else {
				$('#otherSource').hide();
				$('#other').removeClass('required');
			}
			$("#ideaForm").validate();
		});
		
		$('#editSource').change(function(){
			if($('#editSource').val()=='Other'){
				$('#editOtherSource').show();
				$('#editOther').addClass('required');
			} else {
				$('#editOtherSource').hide();
				$('#editOther').removeClass('required');
			}
			$("#ideaForm").validate();
		});
		
		$('#ideaDialog').dialog({title:'Add New Idea to Basket', autoOpen:false, modal:true, resizable:false, width:'400', buttons:{
			"OK": function(){				
				if($("#ideaForm").validate().form()){
					var source = $('#source').val();
					if(source=='Other'){
						source = 'Other: ' + $('#other').val();
					}
					basket.add($('#text').val(),source,$('#tags').val(),$("input[name='flag']:checked").val());
					$(this).dialog("close");
					resetForm('ideaForm');
				}
			}, Cancel: function(){
				$(this).dialog("close");
				resetForm('ideaForm');
			}
		} });
		
		$('#addNew').click(function(){
			$('#ideaDialog').dialog('open');
		});
		
		$('#clearDialog').dialog({title:'Empty Basket', autoOpen:false, modal:true, resizable:false, width:'400', buttons:{
				"OK": function(){				
					localStorage.clear();
					window.location.reload();
				}, Cancel: function(){
					$(this).dialog("close");
			} }
		});
		
		$('#clear').click(function(){
			$('#clearDialog').dialog('open');
		});
		
		$('#export').click(function(){
			document.exportForm['exportIdeas'].value = localStorage.ideas;
			document.exportForm['exportDeleted'].value = localStorage.deleted;
			document.exportForm['exportIndex'].value = localStorage.index;
			$('#exportForm').submit();
		});
		
		$('#importForm').ajaxForm({
      //target : 'import.php',
     	dataType : 'text',
      success : function (response) {
      	var storage = response.replace(/^<head><\/head><body>/,'');
      	storage = storage.replace(/<\/body>$/,'');
      	storage = storage.replace(/\\"/g,'"');
      	var data = storage.split(/\r?\n/);
      	var ideas, deleted, index;
      	if(data[0] && data[1] && data[2]){
      		if (data[0] == "undefined" || data[0] == null || data[0].length>-1){
      			if(data[0].length>0){
      				ideas = JSON.parse(data[0]);
      			} else {
      				ideas = [];
      			}
      		} else {
      			alert('invalid data format');
      			return;
      		}
      		if (data[1] == "undefined" || data[1] == null || data[1].length>-1){
      			if(data[1].length>0){
      				deleted = JSON.parse(data[1]);
      			} else {
      				deleted = [];
      			}
      		} else {
      			alert('invalid data format');
      			return;
      		}
      		if (typeof data[2] === 'string'){
      			index = data[2];
      		} else {
      			alert('invalid data format');
      			return;
      		}
      		localStorage.clear();
      		basket.load(ideas,deleted,index,true);
      	}
      }
    });
    
    $('#importDialog').dialog({title:'Import an Existing Idea Basket', autoOpen:false, modal:true, resizable:false, width:'400', buttons:{
				"Submit": function(){				
					$('#importForm').submit();
					$(this).dialog("close");
				}, Cancel: function(){
					$(this).dialog("close");
			} }
		});
    
    $('#import').click(function(){
			$('#importDialog').dialog('open');
		});
		
		$('#toggleDeleted').toggle(
			function() {
		    $('#trash').fadeIn();
		    $('#toggleDeleted').addClass('visible');
		    $('#showDeleted').text('(Click to hide)');
		    //$('#toggleDeleted img.arrow').attr('src','images/arrow-down.png');
		    return false;
		  },
			function() {
		    $('#trash').fadeOut();
		    $('#toggleDeleted').removeClass('visible');
		    $('#showDeleted').text('(Click to show)');
		    //$('#toggleDeleted img.arrow').attr('src','images/arrow.png');
		    return false;
	  	}
  	);
		
		/*
		if(localStorage.ideas || localStorage.deleted) {
			var ideas;
			if(localStorage.ideas){
				ideas = JSON.parse(localStorage.ideas);
			} else {
				ideas = [];
			}
			var deleted;
			if(localStorage.deleted){
				deleted = JSON.parse(localStorage.deleted);
			} else {
				deleted = [];
			}
			var index = JSON.parse(localStorage.index);
			basket.load(ideas,deleted,index);
		}
		*/
		
		retrieveIdeaBasket();
	}
});

var retrieveIdeaBasket = function() {
	var ideaBasketParams = {
			action:"getIdeaBasket"	
	};
	
	thisView.connectionManager.request('GET', 3, thisView.getConfig().getConfigParam('getIdeaBasketUrl'), ideaBasketParams, displayIdeaBasket, {thisView:thisView, basket:basket});
};

var displayIdeaBasket = function(responseText, responseXML, args) {
	var basket = args.basket;
	
	//parse the idea basket
	var ideaBasket = $.parseJSON(responseText);
	var ideas = [];
	var trash = [];
	
	if(ideaBasket != null) {
		//retrieve the ideas and trash arrays
		ideas = ideaBasket.ideas;
		trash = ideaBasket.trash;
	}
	
	var index = 1;
	
	basket.load(ideas,trash,index);
};

function resetForm(target){
	//clear validator messages
	var validator = $("#" + target).validate();
	validator.resetForm();
	//reset form values
	$('#' + target).find(':input').each(function() {
    switch(this.type) {
	    case 'password':
	    case 'select-multiple':
	    //case 'select-one':
	    case 'text':
	    case 'textarea':
        $(this).val('');
        break;
	    //case 'checkbox':
	    //case 'radio':
	      // this.checked = false;
    }
  });
	/*$(':input','#' + target)
	 .not(':button, :submit, :reset, :hidden')
	 .val('')
	 .removeAttr('checked')
	 .removeAttr('selected');*/
};
