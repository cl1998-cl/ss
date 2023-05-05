import { makeMap, no } from '../../util/share'
import { unicodeRegExp } from '../../util/lang'
import { isNonPhrasingTag } from '../../vdom/web/compiler/util'

const decodingMap = {
	'&lt;': '<',
	'&gt;': '>',
	'&quot;': '"',
	'&amp;': '&',
	'&#10;': '\n',
	'&#9;': '\t',
	'&#39;': "'"
}
const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g

const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const doctype = /^<!DOCTYPE [^>]+>/i
function decodeAttr (value, shouldDecodeNewlines) {
	const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
	return value.replace(re, match => decodingMap[match])
}
const isIgnoreNewlineTag = makeMap('pre,textarea', true)
export const isPlainTextElement = makeMap('script,style,textarea', true)
const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n'

export function parseHTML(html, options){
	console.log(html, 'html===========================>')
	const expectHTML = options.expectHTML
	const isUnaryTag = options.isUnaryTag || no
	const canBeLeftOpenTag = options.canBeLeftOpenTag || no
	const stack = []
	let index = 0, last, lastTag
	
	while(html){
		last = html
		if(!lastTag || !isPlainTextElement(lastTag)){
			let textEnd = html.indexOf('<')
			if(textEnd === 0){
				if(comment.test(html)){
					const commentEnd = html.indexOf('-->')
					advance(commentEnd + 3)
					continue
				}
				if( conditionalComment.test(html)){
				
				}
				
				const doctypeMatch = html.match(doctype)
				if (doctypeMatch) {
					advance(doctypeMatch[0].length)
					continue
				}
				
				// End tag:
				const endTagMatch = html.match(endTag)
				if (endTagMatch) {
					const curIndex = index
					advance(endTagMatch[0].length)
					parseEndTag(endTagMatch[1], curIndex, index)
					continue
				}
				
				// Start tag:
				const startTagMatch = parseStartTag()
				if (startTagMatch) {
					handleStartTag(startTagMatch)
					if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
						advance(1)
					}
					continue
				}
			}
			let text, next, rest
			if (textEnd >= 0) {
				rest = html.slice(textEnd)
				while (
					!endTag.test(rest) &&
					!startTagOpen.test(rest) &&
					!comment.test(rest) &&
					!conditionalComment.test(rest)
					) {
					// < in plain text, be forgiving and treat it as text
					next = rest.indexOf('<', 1)
					if (next < 0) break
					textEnd += next
					rest = html.slice(textEnd)
				}
				text = html.substring(0, textEnd)
			}
			if (textEnd < 0) {
				text = html
			}
			
			if (text) {
				advance(text.length)
			}
			
			if (options.chars && text) {
				options.chars(text, index - text.length, index)
			}
		}
		
	}
	function advance (n) {
		index += n
		html = html.substring(n)
	}
	function parseStartTag () {
		const start = html.match(startTagOpen)
		if (start) {
			const match = {
				tagName: start[1],
				attrs: [],
				start: index
			}
			advance(start[0].length)
			let end, attr
			while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
				attr.start = index
				advance(attr[0].length)
				attr.end = index
				match.attrs.push(attr)
			}
			if (end) {
				match.unarySlash = end[1]
				advance(end[0].length)
				match.end = index
				return match
			}
		}
	}
	
	//入栈且匹配属性
	function handleStartTag (match) {
		const tagName = match.tagName
		const unarySlash = match.unarySlash
		
		if (expectHTML) {
			if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
				parseEndTag(lastTag)
			}
			if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
				parseEndTag(tagName)
			}
		}
		
		const unary = isUnaryTag(tagName) || !!unarySlash
		
		const l = match.attrs.length
		const attrs = new Array(l)
		for (let i = 0; i < l; i++) {
			const args = match.attrs[i]
			const value = args[3] || args[4] || args[5] || ''
			const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
				? options.shouldDecodeNewlinesForHref
				: options.shouldDecodeNewlines
			attrs[i] = {
				name: args[1],
				value: decodeAttr(value, shouldDecodeNewlines)
			}
		}
		
		if (!unary) {
			stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end })
			lastTag = tagName
		}
		
		if (options.start) {
			options.start(tagName, attrs, unary, match.start, match.end)
		}
	}
	
	//出栈
	function parseEndTag (tagName, start, end) {
		let pos, lowerCasedTagName
		if (start == null) start = index
		if (end == null) end = index
		
		if (tagName) {
			lowerCasedTagName = tagName.toLowerCase()
			for (pos = stack.length - 1; pos >= 0; pos--) {
				if (stack[pos].lowerCasedTag === lowerCasedTagName) {
					break
				}
			}
		} else {
			// If no tag name is provided, clean shop
			pos = 0
		}
		if (pos >= 0) {
			// Close all the open elements, up the stack
			for (let i = stack.length - 1; i >= pos; i--) {
				if (options.end) {
					options.end(stack[i].tag, start, end)
				}
			}
			
			// Remove the open elements from the stack
			stack.length = pos
			lastTag = pos && stack[pos - 1].tag
		} else if (lowerCasedTagName === 'br') {
			if (options.start) {
				options.start(tagName, [], true, start, end)
			}
		} else if (lowerCasedTagName === 'p') {
			if (options.start) {
				options.start(tagName, [], false, start, end)
			}
			if (options.end) {
				options.end(tagName, start, end)
			}
		}
	}
}
