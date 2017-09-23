#!/usr/bin/env python3.6

APPLICATION_NAME = "PSS-Calculator.html"
FILES = ("index.html", "index.js", "main.css")
JS_LINE = '<script type="text/javascript" src="index.js"></script>'
JS_NEW_LINE = '<script type="text/javascript">{js_code}</script>'
CSS_LINE = '<link rel="stylesheet" href="main.css">'
CSS_NEW_LINE = '<style>{css_code}</style>'
LINES_TO_REMOVE = [
'<script type="text/javascript">testCalculateFields()</script>',
]


def main():
	with open(APPLICATION_NAME, "w") as f:
		f.write(pack_into_single_file(*read_files(FILES)))


def read_files(files):
	for file in files:
		with open("src/" + file) as f:
			yield f.read()


def pack_into_single_file(html, js, css):
	html = html.replace(JS_LINE, JS_NEW_LINE.format(js_code=js))
	html = html.replace(CSS_LINE, CSS_NEW_LINE.format(css_code=css))
	for line in LINES_TO_REMOVE:
		html = html.replace(line, "")
	return html


if __name__ == "__main__":
	main()
