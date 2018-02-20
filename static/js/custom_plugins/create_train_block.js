

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

stimulus: 'static/img/stimuli/images99/image1.jpg',
key_answer: 74,
correct_text: reward_img,
incorrect_text: punish_img

function makeTrainBlockInstructions(block_stimuli) {

	var img_links = [];
	block_stimuli.forEach(function(item, index, array) {
		img_links.push(item['stimulus']);
	}); //this bit is broken
	console.log(img_links);
	var stimulus_display_html = createStimulusDisplayHTML(img_links);
	var train_block_instructs = '<p>New Block</p><p>Take some time to identify the images for this block.</p><p>[Press SPACEBAR to continue]</p>' + stimulus_display_html; // this hardcoding needs to be fixed. there is some issue with this being an array
	var temp_train_block_instructions = {
		type: "categorize", 
		stimulus: train_block_instructs,
		key_answer: 32,
		timing_response: 3000,
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
	var temp_train_block_end_msg = {
		type: "categorize", 
		stimulus: block_end_instructs,
		key_answer: 32,
		timing_response: 3000,
		show_stim_with_feedback: false,
		show_feedback_on_timeout: false,
		timeout_message: '<p> Block about to begin! </p>',
		timing_feedback_duration: 1500,
		prompt: '',
		incorrect_text: '<p> Block about to begin! </p>',
		correct_text: '<p> Block about to begin! </p>',
		timing_stim: -1
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
		is_html: false,
		prompt: "",
		show_feedback_on_timeout: false,
		timeout_message: train_timeout_feedback, /*defined globally */
		timing_stim: -1,
		timing_response: train_response_timing, /*how long to give for response - defined globally*/
		timing_feedback_duration: train_feedback_duration, /* time to show feedback for - defined globally*/
		timeline: block_stimuli /* stimuli to include -- defined in function*/
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