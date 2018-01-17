# RLWMPST Refactored
### Initial Author: William Ryan (williamhryan@gmail.com), for Anne Collins
### Based on code written by Thomas Wiecki
### First version: 10/11/2017

## Structure of experiment
The task in the experiment is an extension of [this paper.](https://www.ocf.berkeley.edu/~acollins/pdfs/papers/interactions_collins_frank_2017.pdf) This figure describes the task in that paper and its results:

![alt text](https://i.imgur.com/HdhGDai.png "Task from RLWMPST")

 The first main change is that the training phase gives only rewards of +1, not +1 or +2, and gives rewards only most, but not all, of the time that you get a correct answer. The second main change is that the test phase, instead of showing two stimuli and asking you which gave the largest reward, instead only shows one stimuli and asks you what key matched with it previously. 


## Structure of this repo:
Most of the variables in this experiment are defined in `stic/custom_plugins`. These are just Javascript scripts which define a bunch of variables and functions referenced later on. 

The stimuli are all in `static/img/stimuli`. The `/img` directory also contains things like test images, the reward images, UC Berkeley logo, etc.

The main experiments file is `experiment.html`.

CSS for the experiment lives in either JsPsych's css file, `static/jspsych-XXX/css/jspsych.css` or `static/css/custom.css`

## Order of code:
The overall order of this program is:

1. `define_trial_data.js` creates hardcoded variables for all of the instructions text, and characteristics of the experiment like how long to give to respond and how long to display feedback. For normal use of this and iteration with Anne, this is probably all you will have to change. 

2. `define_trial_stimulus.js` takes an array of raw data on the structure of the experiment, and turns it into usable dictionaries of the stimuli and the keys associated with each

3. `create_experiment_intro.js` makes the experiment introduction text

4. `create_train_phase.js` makes the training phase by feeding the dictionary of stimuli created by `define_trial_stimulus.js` into the training block creation function in create_train_block.js for each block

5. `create_test_phase.js` creates the test phase by entering all the stimuli created in `define_trial_stimulus.js` into the testing trials. It also makes the experiment ending message.

6. Then the code directly at the end of `experiment.html` (the timeline definition and JsPsych.init) combines and runs everything!


## Misc. Notes and Gotchas
- Stimuli have to be X by X squares
- There can be no more than 6 stimuli in a set. To change this number, you'll have to update the format of the stimulus display at the start of each training block to account for this. It shouldn't be too hard. 
- ??