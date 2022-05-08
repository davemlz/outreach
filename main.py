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
        if attributes['event_type'] == talkType:
            events.append(event)
    return events

letters = list(map(chr, range(65, 91)))

flags = {
    "en": '<img src="https://raw.githubusercontent.com/davemlz/outreach/master/_static/united-kingdom.png" alt="EN" height="30">',
    "es": '<img src="https://raw.githubusercontent.com/davemlz/outreach/master/_static/spain.png" alt="ES" height="30">'
}

imgs = {
    "pdf": '<img src="https://raw.githubusercontent.com/davemlz/outreach/master/_static/pdf-file.png" alt="PDF" height="30">',
    "google_slides": '<img src="https://raw.githubusercontent.com/davemlz/outreach/master/_static/slides.png" alt="Google Slides" height="30">',
    "youtube": '<img src="https://raw.githubusercontent.com/davemlz/outreach/master/_static/youtube.png" alt="youTube" height="30">'
}

text = []
for talkType in ["talk","lightning talk","workshop","poster"]:
    text.append(f"\n## {talkType.capitalize()}\n\n<table>")
    for event, attributes in data.items():        
        if attributes['event_type'] == talkType:
            link = f"https://github.com/davemlz/outreach/tree/master/{attributes['language'].upper()}/{attributes['folder']}"
            name = attributes['name']
            text.append(f'<tr><td><a href="{link}" target="_blank">{name}</a></td>')
            text.append(f'<td>{attributes["event"]}</td>')
            text.append(f'<td>{flags[attributes["language"]]}</td>')
            text.append('<td>')
            if "pdf" in attributes.keys():
                link_pdf = link + '/' + attributes['pdf']
                text.append(f'<a href="{link_pdf}" target="_blank">{imgs["pdf"]}</a>')
            elif "google_slides" in attributes.keys():
                text.append(f'<a href="{attributes["google_slides"]}" target="_blank">{imgs["google_slides"]}</a>')
            elif "youtube" in attributes.keys():
                text.append(f'<a href="{attributes["youtube"]}" target="_blank">{imgs["youtube"]}</a>')
            text.append('</td>')
            text.append('</tr>\n')
    text.append("</table>\n")

with open('README.md', 'w') as f:
    f.write(previousText + "".join(text))