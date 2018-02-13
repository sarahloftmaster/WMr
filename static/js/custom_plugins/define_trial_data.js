

/*****************************************/
/*****************************************/
/* DEFINE GLOBAL FEATURES OF TRIALS
/*****************************************/
/*****************************************/

/*****************************************/
/* 1.1 Define HTML formats for various things */
/*****************************************/
// This must be before instructions are defined


// JsPsych needs you to feed it html strings
// So, sometimes that means you'll have to have a lot of html around the images you give it
// Instead of doing that ad hoc throughout the program, I do it here, so changes made here
// propogate everywhere


// 1.4.1 Define HTML String for stimuli presentation
// at the start of the training blocks

// Basically it makes a 2x3 table of stimuli. If there are less than 6 stimuli, it fills
// them in with black squares of the same size

// Also because of this solution (there is probably a better one out there...)
// all stimuli have to be squares :p

black_image_path = 'static/img/stimuli/black.jpg';

function createStimulusDisplayHTML(images){
	var to_fill_in = 6 - images.length;
	for (i = images.length; i < 6; i++) {
		images.push(black_image_path);
	};
	var html_string = '<table width=100%>';
	html_string +='<tr>';
	html_string +='<td width=50%><img src="';
	html_string +=images[0];
	html_string +='" width=35% alt=""/></td>';
	html_string +='<td width=50%><img src="';
	html_string +=images[1];
	html_string +='" width=35% alt=""/></td>';
	html_string +='<tr>';
	html_string +='<td width=50%><img src="';
	html_string +=images[2];
	html_string +='" width=35% alt=""/></td>';
	html_string +='<td width=50%><img src="';
	html_string +=images[3];
	html_string +='" width=35% alt=""/></td>';
	html_string +='</tr>';
	html_string +='<tr>';
	html_string +='<td width=50%><img src="';
	html_string +=images[4];
	html_string +='" width=35% alt=""/></td>';
	html_string +='<td width=50%><img src="';
	html_string +=images[5];
	html_string +='" width=35% alt=""/></td>';
	html_string +='</tr>';
	html_string +='</table>';
	return html_string;
}


/*****************************************/
/* 1.2 Reward images */ 
/*****************************************/
// This must be before instructions are defined

var reward_img_path = 'static/img/feedback/reward_minimal.png';
var punish_img_path = 'static/img/feedback/punish_minimal.png';

var reward_img = "<p style='text-align:center'><img class='feedback-image' src=" + reward_img_path + "></img></p>";
var punish_img = "<p style='text-align:center'><img class='feedback-image' src=" + punish_img_path + "></img></p>";


/*****************************************/
/* 1.3 Timings etc for train and test phase */
/*****************************************/
console.log('Create timing variables');
/* Training phase timings */
var train_response_timing = 1500;
var train_feedback_duration = 500;

/* Train phase timeout feedback */
var train_timeout_feedback_txt = "Timeout! Respond faster.";
var train_timeout_feedback = '<p>&nbsp</p><p>&nbsp</p><p>&nbsp</p><p>&nbsp</p><div class="timeout">' + train_timeout_feedback_txt + '</div>';

/* Test phase timings */
var test_response_timing = train_response_timing; /* This could be changed to be seperate, but for now is just the same */
var test_response_timing = train_feedback_duration; /* There is no feedback for the test phase rn */

/* Test phase timeout feedback */
var test_timeout_feedback_txt = train_timeout_feedback_txt;
var test_timeout_feedback = '<div class="timeout">' + test_timeout_feedback_txt + '</div>';

/* Instructions timings */
var instruct_timings_post_trial = 500;

/*****************************************/
/* 1.4 Instructions */
/*****************************************/

console.log('Create instruction variables');
/*  Instruction keys */
var train_instructs_fwd = 32;
var test_instructs_fwd = train_instructs_fwd; //right now I just use the same one, but it's here if you need it

// This is a variable and a function which will allow you to automatically
// add the name of the continue prompt to your trial
var instructions_continue_prompt = '<p>&nbsp</p><p>[Press SPACEBAR to continue]</p>'

function addContinuePrompt(instructions_base) {
	var new_instructs = [];
	instructions_base.forEach(function(item, index, array) {
		var new_str = item + instructions_continue_prompt;
		new_instructs.push(new_str);
	});
	return new_instructs;
}


/*  Training phase instructions */
/* Define individual pages */
var train_instructs_base = ['<p><strong>Working Memory Reinforcement Learning Task</strong></p><p>&nbsp</p><p>In this experiment, you will see an image on the screen. <br>You need to respond to each image by pressing one of the three buttons on the keyboard: <p> j, k or l</p> with your dominant hand.</p>',
'<p>Your goal is to figure out the correct button for each image. <br>You will have a few seconds to respond.</p>',
 '<p>Please respond to every image as quickly and accurately as possible.<br> If you do not respond, the trial will be counted as a loss.</p><p>If you select the correct button, most of the time you will gain points. <br> You can gain 1 point per each trial.</p><p>Sometimes you will NOT receive points even if you <br> select the correct button.</p>',
 '<p>You will gain a larger bonus the more points you win, so try to win as many as possible!',
 '<p>After the practice section, there will be a number of short blocks.</p><p>You can rest between each block.</p><p>At the beginning of each block, you will be shown the set of images for that block.</p><p>Take some time to identify them correctly.</p>',
 '<p>Note the following important rules:</p><p>1. There is ONLY ONE correct response for each image.</p><p>2. One response button MAY be correct for multiple images, or not be correct for any image.</p><p>3. Within each block, the correct response for each image will not change.</p><p>4. When you enter the correct response, most of the time you will be given a reward, but occasionally you will not receive a reward even if you pressed the correct key.</p><p> On the following page you will be given time to familiarize yourself with the images before beginning the block.</p>',
 '<p>Please note that it is important you progress through the task quickly, so you will be given a maximum of 3 minutes to view the instructions for each block</p>'];
/* Combine into an array of pages */
var train_instructs = addContinuePrompt(train_instructs_base);

/*  Example training phase starting instructions */
// Define individual pages
var ex_train_instructs_base = ['<p>Practice Block</p><p>Before you begin, you will be given a practice block <br> to get familiar with how the experiment works</p><p>Your answers here will not count. </p><p>Take some time to identify the images for this block.</p>'];
/* Combine into an array of pages */
var ex_train_instructs = addContinuePrompt(ex_train_instructs_base);

/*  Example training phase ending instructions
/* Define individual pages */
var ex_block_end_instructs_base = ['<p>Practice block complete!</p><p>When ready you can move on and begin the experiment.</p>'];
/* Combine into an array of pages */
var ex_block_end_instructs = addContinuePrompt(ex_block_end_instructs_base);

/* Test phase instructions */
/* Define individual pages */
var test_instructs_base = ['<p>Great! You are almost done with this experiment.</p>',
 '<p>It is time to test what you have learned.</p><p>&nbsp</p><p>You will see one image on the screen at a time. Enter the key that gave you the greatest number of rewards for each image previously. If you are not sure which key to press, just go with your gut instinct!</p><p>During this set of trials you will NOT receive feedback about your responses. However, your performance will still count towards your bonus, so be as accurate as possible.</p><p>As before, respond to each image by pressing one of the three buttons on the keyboard:<p> j, k or l</p> with your dominant hand.</p>'];
/* Combine into an array of pages */
var test_instructs = addContinuePrompt(test_instructs_base);

/* End of test phase instructions */
/* Define individual pages */
var end_of_test_instructs_base = ['']; // This is not used currently -- you just end the experiment directly afterwards
/* Combine into an array of pages */
var end_of_test_instructs = addContinuePrompt(end_of_test_instructs_base);

/* Block-by-block instructions */
/* Define individual pages */
var block_start_instructs_base = ['<p><strong>New Block</strong></p><p>&nbsp</p><p>Take some time to identify the images for this block.</p>']; // Need to add in block number !
/* Combine into an array of pages */
var block_start_instructs = addContinuePrompt(block_start_instructs_base);

/* Define individual pages */
var block_end_instructs_base = ['<p>Block complete!</p>']; // Need to add in block number !
/* Combine into an array of pages */
var block_end_instructs = addContinuePrompt(block_end_instructs_base);

/*****************************************/
/* 1.4 Experiment end messages */
/*****************************************/
console.log('Create end message variables');

var experiment_end_msg = ['<p>Done!</p><p>Thank you for participating! Press SPACEBAR to complete the experiment, your payment will arrive soon.</p>'];



