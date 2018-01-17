require(jsonlite)
require(readr)
require(plyr)

setwd("C:/Users/William/Documents/Berkeley_Post-Bac/Anne_Collins_Lab/Amazon Mechanical Turk/RLWM_PST/oh_god/hmm/data")

name1 = 'raw1'


raw1 = read_file("./test_data/participant3.txt")
raw2 = read_file("./test_data/participant2.txt")

json1 = fromJSON(raw1)
json2 = fromJSON(raw2)

data1 = json1[8][1]
data2 = json2[8][1]

df1 = data1[[1]][4]
df2 = data2[[1]][4]

df1 = df1$trialdata
df2 = df2$trialdata


trials1 = df1[df1$trial_type=="categorize",]
length(unique(trials1$stimulus))
#only 62 unique stimuli



#for main
master_df$stimuli_path = paste0(master_df$img_folder, master_df$stim_num)


#get only numbers from image paths
stimuli = trials1$stimulus

stimuli_nums <- regmatches(stimuli, gregexpr("[[:digit:]]+", stimuli))

new_vec = rep(1,length(stimuli_nums))

for (i in 1:length(stimuli_nums)){
  new_vec[i] = paste0(stimuli_nums[i][1][[1]][[1]], stimuli_nums[i][1][[1]][[2]])
}

trials1$stimuli_path = new_vec

new_df = join(trials1,master_df, by="stimuli_path", type="right")

