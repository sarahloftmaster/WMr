/****************
* Questionnaire *
****************/
var Questionnaire = function() {
	//this used to take bonus as an input, but we are not automatically calculating it at the moment
	// we also made all psiTurk --> psiturk
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {
		var question_data = []

		// $('input').each( function(i, val) {
		// 	psiTurk.recordUnstructuredData(this.id, this.value);		
		// });
		$('input:checked').each( function(i, val) {
			question_data.push(this.name + ': ' + this.value)		
		});

		psiturk.recordTrialData({'phase':'questionnaire', 
								'status':'submit', 
								//'Bonus': bonus,
								'response': question_data}
								);
	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiturk.saveData({
			success: function() {
			    clearInterval(reprompt); 
			    psiturk.completeHIT();
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet
	psiturk.showPage('questionnaire.html');
	psiturk.recordTrialData({'phase':'questionnaire', 'status':'begin'});
	
	$("#submit").click(function () {
	    record_responses();
	    psiturk.saveData({
            success: function(){
            	//REQCHANGE: HOW SHOULD BONUSES BE COMPUTED?
                //psiTurk.computeBonus('compute_bonus', function() { 
                //alert("Thanks for participating! Your bonus is: $" + bonus);
                alert("Thanks for participating! Your bonus is being computed by the experimenter and will be sent to you soon.");
                psiturk.completeHIT(); // when finished saving compute bonus, the quit
                //}); 
            }, // for some reason when prompt_resubmit gets triggered below, replaceBody can't be found ...
            error: prompt_resubmit});
	});
    
	
};