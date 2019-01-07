# jpan-polly
A quick node.JS script that links Box, AWS Polly, and AWS S3

# Introduction
This script downloads the extracted text representation from a file on Box, uploads that extracted text to AWS Polly, and then returns Polly's .mp3 to Box. It is also possible to specify an S3 bucket instead of Box.

# Usage
Assuming that the prerequisites are filled, follow these steps in order:
1. Clone the repository to a local directory
1. Run `npm install`
1. At the root folder of the directory, save your config file generated from [Box's Quickstart Guide](https://developer.box.com/docs/authenticate-with-jwt#section-step-2-generate-configuration)
1. In the script, fill in the proper values for:
  1. Box File ID - this file's extracted text (Box does the extracting) will be pulled from this file
  1. Box Folder ID - target destination for the .mp3 file from Polly
  1. Path to config file (https://github.com/jasonpan12/jpan-polly/blob/master/index.js#L5)
  
# Prerequisites
* Installed / set up AWS credentials on your machine
* Node.JS 
