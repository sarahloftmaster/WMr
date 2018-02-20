
/*****************************************/
/*****************************************/
/* CREATE TEST PHASE */
/*****************************************/
/*****************************************/
/* This code makes the test phase */

console.log('Begin test phase creation!');

var test_instructs_oneline = '<p>Great! You are almost done with this experiment.</p><p>It is time to test what you have learned.</p><p>&nbsp</p><p>You will see one image on the screen at a time. Enter the key that gave you the greatest number of rewards for each image previously. If you are not sure which key to press, just go with your gut instinct!</p><p>During this set of trials you will NOT receive feedback about your responses. However, your performance will still count towards your bonus, so be as accurate as possible.</p><p>As before, respond to each image by pressing one of the three buttons on the keyboard:<p> j, k or l</p> with your dominant hand.</p><p>&nbsp</p><p>[Press SPACEBAR to continue]</p>'

/* This is the instructions block for the test phase*/
var test_phase_instructions = {
	type: "categorize", 
	stimulus: test_instructs_oneline,
	is_html: true,
	choices: [32, 74, 75, 76],
	key_answer: 32,
	timing_response: 180000,
	show_stim_with_feedback: false,
	show_feedback_on_timeout: false,
	timeout_message: '<p> Next phase about to begin! </p>',
	timing_feedback_duration: 1500,
	prompt: '',
	incorrect_text: '<p> Next phase about to begin! </p>',
	correct_text: '<p> Next phase about to begin! </p>',
	timing_stim: -1
};

/* this is the test phase for the experiment */
var test_phase = {
	type: 'categorize', 
	choices: train_keys, /*defined globally */
	correct_text: "", /*defined globally */
	incorrect_text: "", /*defined globally */
	show_stim_with_feedback: false,
	is_html: false,
	prompt: "",
	show_feedback_on_timeout: false,
	timeout_message: train_timeout_feedback, /*defined globally */
	timing_stim: -1,
	timing_response: train_response_timing, /*how long to give for response - defined globally*/
	timing_feedback_duration: train_feedback_duration, /* time to show feedback for - defined globally*/
	timeline: test_stimuli_dict_list /* stimuli to include -- defined in function*/
};
console.log('Test phase created!');

//ummmmmm