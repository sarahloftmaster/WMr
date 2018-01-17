/*****************************************/
/*****************************************/
/* CREATE EXAMPLE TRAIN BLOCK */
/*****************************************/
/*****************************************/
/* This code makes the example block given at
the start of the experiment, where performance 
does not matter
*/
console.log('Begin example train block creation!');
/*****************************************/

/*****************************************/
/* 1. Create single training phase block*/
/*****************************************/


/*****************************************/
/*1.1  This is an example training phase block instructions at beginning  */
/*****************************************/

function makeExampleTrainBlockInstructions(block_stimuli) {

	var img_links = [];
	block_stimuli.forEach(function(item, index, array) {
		img_links.push(item['stimulus'])
	});
	console.log(img_links)
	var stimulus_display_html = createStimulusDisplayHTML(img_links.slice(0,2)); // right now because a dict is being fed, it actually shows too many images, so I'm slicing it. This should be fixed at some point
	var ex_train_block_instructs = '<p><strong>Practice Block</strong></p><p>&nbsp</p><p>Before you begin, you will be given a practice block <br> to get familiar with how the experiment works. <br> Your answers here will not count.<br>  Take some time to identify the images for this block.</p><p>As a reminder, for each image press one of the following keys on your keyboard:</p><p>j, k, l </p> <p>[Press SPACEBAR to continue]</p>' + stimulus_display_html; 
	var ex_temp_train_block_instructions = { //this stuff is hardcoded too ew, fix
		type: "instructions", 
		pages: [ex_train_block_instructs], 
		key_forward: train_instructs_fwd
	};
    return ex_temp_train_block_instructions;          
}
/*****************************************/
/* 1.2 This is an example training phase end of block message */
/*****************************************/
function makeExampleTrainBlockEndMsg() {
	var ex_temp_train_block_end_msg = {
		type: "instructions", // I need to change this so it is variables and not hard-coded!!!
		pages: ['<p>Practice block complete!</p><p>When ready you can move on and begin the experiment.</p><p>[Press SPACEBAR to continue]</p>'], // This line is hardcoded ugh
		key_forward: train_instructs_fwd
	};
    return ex_temp_train_block_end_msg;            
}
/*****************************************/
/* 1.3 This is an example training phase learning block  */
/*****************************************/
function makeExampleTrainBlock(block_stimuli) {
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
		timeline: block_stimuli, /* stimuli to include -- defined in function*/
    };
    return temp_train_block;
}


console.log('Example train block created!');

/*****************************************/
/* 2.1 Use those functions to create the example training phase block  */
/*****************************************/

ex_training_phase_timeline = [];

ex_block_inst = makeExampleTrainBlockInstructions(example_stimuli_dicts);
ex_new_block = makeExampleTrainBlock(example_stimuli_dicts);
ex_block_end = makeExampleTrainBlockEndMsg();

ex_training_phase_timeline.push(ex_block_inst);
ex_training_phase_timeline.push(ex_new_block);
ex_training_phase_timeline.push(ex_block_end);

console.log('Example train timeline created!')