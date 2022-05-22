import requests

source_url = 'github.com/GTcreyon/FocalAnchors'
url = 'https://javascript-minifier.com/raw'

text = open('focal-anchors.js', 'rb').read()
data = {'input':text}
response = requests.post(url, data=data)

file = open('focal-anchors.min.js', "w")
file.write(response.text + '\n//' + source_url)
file.close()

print('reduction: ' + str(len(text) - len(response.text)) + ' bytes')