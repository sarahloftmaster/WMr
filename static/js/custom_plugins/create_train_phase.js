
/*****************************************/
/*****************************************/
/* CREATE TRAIN PHASE */
/*****************************************/
/*****************************************/
/* This code makes the training phase */
/* It directly relies on create_train_block.js */

/* This should create the timeline for the training phase */

/* Call the create train block function a number of times equal to the # of training blocks */
/* push the results of each to the training phase timeline */
/*then later integrate that into the overall timeline */
training_phase_timeline = [];


stimuli_dicts_by_block.forEach(function(item, index, array) {
	var new_block = makeTrainBlock(item); // this function seems fine. however, images only display if this comes before makeTrainBlockInstructions
	var block_inst = makeTrainBlockInstructions(item); //this function seems OK
	console.log('Making the block');
	console.log(new_block);
	console.log('Making the end message');
	var block_end = makeTrainBlockEndMsg(); // this function seems OK.

	training_phase_timeline.push(block_inst);
	training_phase_timeline.push(new_block);
	training_phase_timeline.push(block_end);
});

