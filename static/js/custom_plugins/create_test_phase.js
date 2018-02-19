
/*****************************************/
/*****************************************/
/* CREATE TEST PHASE */
/*****************************************/
/*****************************************/
/* This code makes the test phase */

console.log('Begin test phase creation!');

	/* This is the instructions block for the test phase*/
	var test_phase_instructions = {
		type: "instructions",
		pages: test_instructs,
		key_forward: test_instructs_fwd,
		time_limit = 3000
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