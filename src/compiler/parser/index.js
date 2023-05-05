import { parseHTML } from './html-parser'
import { isServerRendering } from '../../util/env'
import { parseText } from './text-parser'
import { cached } from '../../util/share'
import { pluckModuleFunction } from '../helpers'
let delimiters
let transforms
let preTransforms
let postTransforms
let platformIsPreTag
let platformMustUseProp
let platformGetTagNamespace
let maybeComponent

//const decodeHTMLCached = cached(he.decode)
//暂不处理关于指令方面的编译
export function parse (template, options) {
	let num = 0
	function closeElement (element) {
		if (currentParent && !element.forbidden) {
			currentParent.children.push(element)
			element.parent = currentParent
			
		}
	}
	
	transforms = pluckModuleFunction(options.modules, 'transformNode')
	preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
	postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')
	const stack = []
	
	let root
	let currentParent
	let inVPre = false
	let inPre = false
	let warned = false
	
	parseHTML(template, {
		start (tag, attrs, unary, start, end) {
			let element = createASTElement(tag, attrs, currentParent)
			if (isForbiddenTag(element) && !isServerRendering()) {
				element.forbidden = true
			}
			
			if (!root) {
				root = element
				
			}
			if (!unary) {
				currentParent = element
				stack.push(element)
			} else {
				closeElement(element)
			}
		},
		end () {
			const element = stack[stack.length - 1]
			stack.length -= 1
			currentParent = stack[stack.length - 1]
			closeElement(element)
		},
		chars (text, start, end) {
			if (!currentParent) return
			const children = currentParent.children
			
			if(text.trim()){
				text = text
				//text = isTextTag(currentParent) ? text : decodeHTMLCached(text)
			}else if(!children.length){
				text = ' '
			}else {
				text = ' '
			}
			
			console.log(text!== ' ',++num,text)
			let res
			let child
			if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
				child = {
					type: 2,
					expression: res.expression,
					tokens: res.tokens,
					text
				}
			} else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
				child = {
					type: 3,
					text
				}
			}
			
			if (child) {
				children.push(child)
			}
		},
		
		comment () {
		
		}
	})
	
	console.log(root, 'root=====================>')
	return root
}

export function createASTElement (
	tag,
	attrs,
	parent
) {
	return {
		type: 1,
		tag,
		attrsList: attrs,
		attrsMap: makeAttrsMap(attrs),
		rawAttrsMap: {},
		parent,
		children: []
	}
}

function makeAttrsMap (attrs) {
	const map = {}
	for (let i = 0, l = attrs.length; i < l; i++) {
		map[attrs[i].name] = attrs[i].value
	}
	return map
}

function isForbiddenTag (el) {
	return (
		el.tag === 'style' ||
		(el.tag === 'script' && (
			!el.attrsMap.type ||
			el.attrsMap.type === 'text/javascript'
		))
	)
}


function isTextTag (el) {
	return el.tag === 'script' || el.tag === 'style'
}
