
###########################################################
#   THIS FILE IS NEVER USED IN THE PROGRAM
#
#   IT IS INCLUDED AS A REFERENCE WHILE I RECODE IT, SINCE
#   IT HAS THE CORRECT INSTRUCTIONS TEXT
###########################################################



from __future__ import division

from flask import Blueprint, render_template, request, jsonify, Response, abort, current_app
from jinja2 import TemplateNotFound
from functools import wraps
from sqlalchemy import or_

from psiturk.psiturk_config import PsiturkConfig
from psiturk.experiment_errors import ExperimentError
from psiturk.user_utils import PsiTurkAuthorization, nocache

# # Database setup
from psiturk.db import db_session, init_db
from psiturk.models import Participant
from json import dumps, loads

import pandas as pd
import numpy as np
import os

import json
# get this object
from flask import Response

# load the configuration options
config = PsiturkConfig()
config.load_config()

# explore the Blueprint
custom_code = Blueprint('custom_code', __name__, template_folder='templates', static_folder='static')


###########################################################
#  serving warm, fresh, & sweet custom, user-provided routes
#  add them here
###########################################################

#----------------------------------------------
# example computing bonus
#----------------------------------------------

@custom_code.route('/testme')
def testme():
    return 'test worked!'

@custom_code.route('/compute_bonus', methods=['GET'])
def compute_bonus():
    # check that user provided the correct keys
    # errors will not be that gracefull here if being
    # accessed by the Javascrip client
    if not request.args.has_key('uniqueId'):
        raise ExperimentError('improper_inputs')  # i don't like returning HTML to JSON requests...  maybe should change this
    uniqueId = request.args['uniqueId']

    try:
        # lookup user in database
        user = Participant.query.\
               filter(Participant.uniqueid == uniqueId).\
               one()
        user_data = loads(user.datastring) # load datastring from JSON

        n_trials = 0
        for record in user_data['data']: # for line in data file
            trial = record['trialdata']
            cur_trl_type = data_trl.get('trial', '')
            if cur_trl_type != trl_type:
                continue
            if trl_type == 'train':
                points = int(data_trl['points']) if 'points' in data_trl else np.nan
                n_trials += 1

        bonus = points * .01

        user.bonus = bonus
        db_session.add(user)
        db_session.commit()
        resp = {"bonusComputed": "success"}
        return jsonify(**resp)
    except:
        abort(404)  # again, bad to display HTML, but...


@custom_code.route('/get_trials', methods=['GET'])
def get_trials():
    debug = False
    map_kbd = {13.0: 74,
               14.0: 75,
               15.0: 76,
    }

    local_path = os.getcwd()
    task_id = 6
    set_id = 1

    base_path = os.path.join(local_path, 'static', 'rlwmpst', 'V{}'.format(task_id), 'S_{}'.format(set_id))

    train_instruction_trials = pd.read_csv(os.path.join(base_path, 'train_instruction.csv'), index_col=0)
    train_instruction_trials.index += 1
    train_trials = pd.read_csv(os.path.join(base_path, 'train.csv'), index_col=0)
    test_trials = pd.read_csv(os.path.join(base_path, 'test.csv'), index_col=0)

    get_ready = {'type': "text",
                 'text': "<div id='jspsych-instructions'>Get ready!"
                 "<p>[Press any key to continue!]</p></div>",
                 'timing_post_trial': 1000
    }

    instructions = create_instructions(
        nblocks=len(train_trials['block #'].unique())
    )

    exp = []

    for page in instructions:
        trl = {'type': "text",
               'text': "<div id='jspsych-instructions'>{}"
               "<p>[Press any key to continue!]</p></div>".format(page),
               'timing_post_trial': 500
        }
        if not debug:
            exp.append(trl)


    # Practice trials
    instruct_text = "<p>Practice session!</p><p>You will next get some practice trials which will not count to your final score.</p>"
    instruct_text_trl = {'type': "text",
           'text': "<div id='jspsych-instructions'>{}"
           "<p>[Press any key to continue!]</p></div>".format(instruct_text),
           'timing_post_trial': 500
    }
    if not debug:
        exp.append(instruct_text_trl)
#        exp.append(get_ready)

    instruct_trl = create_instruction_trial({'set size': 2,
                                             'image folder': 99,
                                             'image1': 1,
                                             'image2': 2})
    if not debug:
        #exp.append(instruct_trl)
    for i in range(10):
        train_trial = {'CorrectFB value': np.random.randint(1, 3),
                       'correct action #': (i % 2) + 13.,
                       'correct key#': (i % 2) + 13.,
                       'image folder': 99,
                       'image number': (i % 2) + 1,
                       'overall stimulus id': 99,
        }
        trl = create_train_trial(train_trial,
                                 map_kbd,
                                 task_id=task_id,
                                 set_id=set_id,
                                 set_size=2,
        )
        trl['prompt'] = '<p>Press the j, k, or l key.</p><p>Learn from the feedback which keys are correct.</p>'
        if not debug:
            exp.append(trl)


    for block in train_trials['block #'].unique():
        instruct_text = "<p>Block {}</p><p>Take some time to identify the images for this block.</p>".format(block)
        instruct_text_trl = {'type': "text",
               'text': "<div id='jspsych-instructions'>{}"
               "<p>[Press any key to continue!]</p></div>".format(instruct_text),
               'timing_post_trial': 500
        }
        if not debug:
            exp.append(instruct_text_trl)
#            exp.append(get_ready)

        instruct_trl = create_instruction_trial(train_instruction_trials.loc[block])
        if not debug:
            exp.append(instruct_trl)

        for _, train_trial in train_trials.loc[train_trials['block #'] == block].iterrows():
            trl = create_train_trial(train_trial,
                                     map_kbd,
                                     block=block,
                                     set_id=set_id,
                                     task_id=task_id,
                                     set_size=train_instruction_trials.loc[block, 'set size'],
            )
            exp.append(trl)
            if debug:
                break

        instruct_text_trl = {'type': "text",
               'text': "<div id='jspsych-instructions'>End of block"
                             "<p>[Press any key to continue!]</p></div>",
               'timing_post_trial': 500
        }
        exp.append(instruct_text_trl)
        if debug:
            break

    test_instructions = create_test_instructions()
    for page in test_instructions:
        trl = {'type': "text",
               'text': "<div id='jspsych-instructions'>{}"
               "<p>[Press any key to continue!]</p></div>".format(page),
               'timing_post_trial': 500
        }
        if not debug:
            exp.append(trl)

    for i, (_, test_trial) in enumerate(test_trials.iterrows()):
        trl = create_test_trial(test_trial, set_id=set_id, task_id=task_id, prompt=i < 5)
        exp.append(trl)

        if debug:
            break

    instruct_text_trl = {'type': "text",
                         'text': "<div id='jspsych-instructions'>Done!<p>Thank you for participating! Press space and your payment arrive soon.</p>"
                         "<p>[Press any key to continue!]</p></div>",
                         'timing_post_trial': 500,
                         'timeout': 8000,
    }
    exp.append(instruct_text_trl)

    return Response(json.dumps(exp), mimetype='application/json')


def create_instruction_trial(instruct):
    instruct_trl = {'type': 'rlwmpst-instruct',
                    'trial_type': 'instruct',
                    'set_size': instruct['set size'],
                    'images': [],
                    'prompt': '<p>Take some time to familiarize yourself with the images. Press a key when ready.</p>'
    }

    html_img = '<td width=25%><img src="{src}" width=75% alt=""/></td>'
    img_stims = []
    for i in range(int(instruct['set size'])):
        img_path = os.path.join('static', 'images', 'rlwmpst',
                                'images' + str(int(instruct['image folder'])),
                                'image{}.jpg'.format(str(int(instruct['image{}'.format(i+1)])))
        )
        instruct_trl['images'].append(img_path)
        img_stims.append(html_img.format(src=img_path))

    while len(instruct_trl['images']) < 6:
        img_path = os.path.join('static', 'images', 'rlwmpst', 'black.jpg')
        instruct_trl['images'].append(img_path)
        img_stims.append(html_img.format(src=img_path))

    stim = '<table width="100%"><tr>'
    for i, img_stim in enumerate(img_stims):
        stim += "\n"
        stim += img_stim
        if i == 2:
            stim += "</tr><tr>"
    stim += '</tr></table>'

    instruct_trl['stimulus'] = stim

    return instruct_trl


def create_train_trial(train_trial, map_kbd, set_id=-1, task_id=-1, block=-1, set_size=-1):
    stimulus = os.path.join('static', 'images', 'rlwmpst',
        'images' + str(int(train_trial['image folder'])),
        'image{}.jpg'.format(str(int(train_trial['image number'])))
    )

    trl = {'type': 'rlwmpst',
           'train_or_test': 'train',
           'stimulus': stimulus,
           'block': int(block),
           'correct_action': train_trial['correct action #'],
           'correct_key': map_kbd[train_trial['correct key#']],
           'reward_if_correct': train_trial['CorrectFB value'],
           'image_folder': int(train_trial['image folder']),
           'image_number': int(train_trial['image number']),
           'timing_response': 1500, # timeout
           'timing_iti_feedback': 0,
           'timing_feedback_duration': 500,
           'choices': map_kbd.values(),
           'small_reward_path': os.path.join('static', 'images', 'small_reward.png'),
           'large_reward_path': os.path.join('static', 'images', 'large_reward.png'),
           'noreward_path': os.path.join('static', 'images', 'zero.png'),
           'display_feedback': True,
           'is_html': False,
           'set_id': set_id,
           'task_id': task_id,
           'set_size': set_size,
           'overall_stimulus_id': int(train_trial['overall stimulus id']),
    }

    return trl

def create_test_trial(test_trial, set_id=-1, task_id=-1, prompt=True):
    left_img = os.path.join('static', 'images', 'rlwmpst',
        'images' + str(int(test_trial['left image folder'])),
        'image{}.jpg'.format(str(int(test_trial['left image number'])))
    )
    right_img = os.path.join('static', 'images', 'rlwmpst',
        'images' + str(int(test_trial['right image folder'])),
        'image{}.jpg'.format(str(int(test_trial['right image number'])))
    )

    stim = '<table width="100%"><tr>'
    stim += '<td width=25%><img src="{}" width=25% alt=""/></td>'.format(left_img)
    #stim += '<td width=25%><img src="{}" width=75% alt=""/></td>'.format(right_img)
    stim += '</tr></table>'

    trl = {'type': 'rlwmpst',
           'train_or_test': 'test',
           'left_img': left_img,
           'right_img': right_img,
           'left_image_folder': int(test_trial['left image folder']),
           'right_image_folder': int(test_trial['right image folder']),
           'left_image_name': int(test_trial['left image number']),
           'right_image_name': int(test_trial['right image number']),
           'stimulus': stim,
           'timing_response': 1500, # timeout
           'timing_feedback_duration': 500,
           'choices': (74, 75, 76), # j, k ,l 
           'display_feedback': False,
           'is_html': True,
           'set_id': set_id,
           'task_id': task_id,
           'left_stimulus_id': int(test_trial['left stimulus id']),
           'right_stimulus_id': int(test_trial['right stimulus id']),
    }

    if prompt:
        trl['prompt'] = '<p>Press the j, k, or l key.</p>'

    return trl


def create_instructions(nblocks=2):
    pages = []
    text = '<p>Working Memory Reinforcement Learning Task</p>'
    text += '<p>In this experiment, you will see an image on the screen.</p>'
    text += '<p>You need to respond to each image by pressing one</p> of the three buttons on the keyboard:<p> j, k or l</p> with your dominant hand.</p>'
    pages.append(text)

    text = '<p>Your goal is to figure out the correct button for each image.'
    text += '<p>You will have a few seconds to respond.</p>'
    pages.append(text)

    text = '<p>Please respond to every image as quickly and accurately as possible.</p>'
    text += '<p>If you do not respond, the trial will be counted as a loss.</p>'
    text += '<p>If you select the correct button, most of the time you will gain points.</p>'
    text += '<p>You can gain 1 point per each trial.</p>'
    text += '<p>Sometimes you will NOT receive points even if you select the correct button.</p>'

    pages.append(text)

    #text = '<p>You can gain either 1 or 2 points designated as +1 (small reward) or +2 (big reward).</p>'
    text = '<p>You will gain a larger bonus the more points you win, to try to win as many as possible!'
    pages.append(text)

    text = '<p>After the practice section, there will be {} short blocks.</p>'.format(nblocks)
    text += '<p>You can rest between each block.</p>'
    text += '<p>At the beginning of each block, you will be shown the set of images for that block.</p>'
    text += '<p>Take some time to identify them correctly.</p>'
    pages.append(text)

    text = '<p>Note the following important rules:</p>'
    text += '<p>1. There is ONLY ONE correct response for each image.</p>'
    text += '<p>2. One response button MAY be correct for multiple images, or not be correct for any image.</p>'
    text += '<p>3. Within each block, the correct response for each image will not change.</p>'
    text += '<p>4. The more correct responses you give, the faster you will finish the block.</p>'
    text += '<p> On the following page you will be given time to familiarize yourself with the images before beginning the block.</p>'

    pages.append(text)

    return pages

def create_test_instructions():
    pages = []
    text = '<p>Great! You are almost done with this experiment.</p>'
    pages.append(text)

    text = '<p>It is time to test what you have learned.</p><p>During this set of trials you will NOT recieve feedback to your responses.</p>'
    text += '<p>You will see one image on the screen at a time.\n\n\n</p><p>Enter the key that gave a reward for that image previously</p>'
    text += '<p>If you are not sure which key to press,<br>just go with your gut instinct!</p>'
    text += '<p>As before, respond to each image by pressing one</p> of the three buttons on the keyboard:<p> j, k or l</p> with your dominant hand.</</p>'
    pages.append(text)

    return pages
