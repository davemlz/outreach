import json

previousText = """# Outreach Activities

Hey, geospatial enthusiasts! This repository contains the material that 
I have used for multiple workshops, conferences and courses. Enjoy!
"""

with open('src/events.json', 'r') as f:
    data = json.load(f)

def filterByTalkType():
    events = []
    for event, attributes in data.items():        
        if attributes['event'] == talkType:
            events.append(event)
    return events

letters = list(map(chr, range(65, 91)))

text = []
for talkType in ["talk","lightning talk","workshop","poster"]:
    text.append(f"\n## {talkType.capitalize()}\n\n<table>")
    for event, attributes in data.items():        
        if attributes['event'] == talkType:
            link = f"https://github.com/davemlz/outreach/tree/master/{attributes['language'].upper()}/{attributes['folder']}"
            name = attributes['name']
            line = f'<tr><td width="50%"><a href="{link}" target="_blank">{name}</a></td></tr>\n'
            text.append(line)
    text.append("</table>\n")

with open('README.md', 'w') as f:
    f.write(previousText + "".join(text))