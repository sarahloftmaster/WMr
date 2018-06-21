

/*****************************************/
/*****************************************/
/* CREATE TRAIN BLOCK */
/*****************************************/
/*****************************************/
/* This code makes a single block in the */
/* training phase of the experiment */


console.log('Begin train block creation!');
/*****************************************/

/*****************************************/
/* 1. Create single training phase block*/
/*****************************************/


/*****************************************/
/*1.1  This is a training phase block instructions at beginning  */
/*****************************************/

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

function makeTrainBlockInstructions(block_stimuli) {
	var img_links = [];
	block_stimuli.forEach(function(item, index, array) {
		img_links.push(item['base_path']); //William pushing 'stimulus' in his version of the code - important?
	}); //this bit is broken
	console.log(img_links);
	var stimulus_display_html = createStimulusDisplayHTML(img_links.unique());
	var train_block_instructs = '<p>New Block</p><p>Take some time to identify the images for this block.</p><p>[Press SPACEBAR to continue]</p>' + stimulus_display_html; // this hardcoding needs to be fixed. there is some issue with this being an array
	var temp_train_block_instructions = {
		type: "categorize", 
		stimulus: train_block_instructs,
		is_html: true,
		choices: [32, 74, 75, 76],
		key_answer: 32,
		timing_response: 180000,
		show_stim_with_feedback: false,
		show_feedback_on_timeout: false,
		timeout_message: '<p> Block about to begin! </p>',
		timing_feedback_duration: 1500,
		prompt: '',
		incorrect_text: '<p> Block about to begin! </p>',
		correct_text: '<p> Block about to begin! </p>',
		timing_stim: -1
	};
    return temp_train_block_instructions;          
}
/*****************************************/
/* 1.2 This is a training phase end of block message */
/*****************************************/
function makeTrainBlockEndMsg() {
	var block_end_instructs = '<p>Block complete!</p><p>[Press SPACEBAR to continue]</p>'; // this hardcoding needs to go away
	var experiment_early_end_instructs = "<p> We are sorry, but your performance on the experiment so far indicates you have not been engaged, so the experiment will end early. </p><p> You will be be given compensation through a bonus for your time spent so far.</p><p> [Press any key to conclude the experiment]</p>"
	var temp_train_block_end_msg = {
		type: "categorize", 
		stimulus: function(){ //if their performance is too low @ end of 4th or 8th block, end experiment early
			if((current_correct_count/total_trials_count)<.35 && (current_block==4)){ // end conditions
				kill_check = 1; //this check is used in the end of the function to end if it is set to 1
				return[experiment_early_end_instructs];
			} else {
				return[block_end_instructs];
			}	
		},
		is_html: true,
		choices: [32, 74, 75, 76],
		key_answer: 32,
		timing_response: 30000,
		show_stim_with_feedback: false,
		show_feedback_on_timeout: false,
		timeout_message: '<p> Proceeding to next block introduction page </p>',
		timing_feedback_duration: 1500,
		prompt: '',
		incorrect_text: '',
		correct_text: '',
		timing_stim: -1,
		on_finish: function(){ //ends the HIT if performance was too low
			if(kill_check == 1){
				console.log("Kill check confirmed")
				psiturk.saveData(); // save the data for the participant
				psiturk.completeHIT(); // end the trial early
			} else {
				console.log("Performance is good enough");
			}

		}
	};
    return temp_train_block_end_msg;            
}
/*****************************************/
/* 1.3 This is a training phase learning block  */
/*****************************************/
function makeTrainBlock(block_stimuli) {
    var temp_train_block = {
		type: 'categorize', 
		choices: train_keys, /*defined globally */
		show_stim_with_feedback: false,
		is_html: true,
		prompt: "",
		show_feedback_on_timeout: false,
		timeout_message: train_timeout_feedback, /*defined globally */
		timing_stim: -1,
		timing_response: train_response_timing, /*how long to give for response - defined globally*/
		timing_feedback_duration: train_feedback_duration, /* time to show feedback for - defined globally*/
		timeline: block_stimuli, /* stimuli to include -- defined in function*/
		on_finish: function(data){
			console.log("Trial finished")
			current_block = data.block_data
			console.log(data)
			if(data.correct==true){
				console.log("Correct. add!")
				current_correct_count = current_correct_count + 1
				total_trials_count = total_trials_count + 1
				console.log("Correct count:")
				console.log(current_correct_count)
				console.log("Total count:")
				console.log(total_trials_count)
			} else {
				console.log("Incorrect, don't add!")
				console.log(current_correct_count)
				total_trials_count = total_trials_count + 1
				console.log("Correct count:")
				console.log(current_correct_count)
				console.log("Total count:")
				console.log(total_trials_count)
			}
		} 
    };
    return temp_train_block;
}


console.log('Train block created!');
/*		 on_finish: function(){
	      jsPsych.pauseExperiment();
	      jsPsych.addNodeToEndOfTimeline({
	        timeline: [{
	          type: 'instructions',
	          pages: block_end_instructs,
	          key_forward: 32
	        }]
	      }, jsPsych.resumeExperiment)
	    } */