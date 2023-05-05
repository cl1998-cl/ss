import { extend, no, noop } from '../../util/share'
import { genHandlers } from './events'
import { pluckModuleFunction } from '../helpers'
import baseDirectives from '../directives/index'
export class CodegenState {
	options
	warn
	transforms
	dataGenFns
	directives
	maybeComponent
	onceId
	staticRenderFns
	pre
	
	constructor (options) {
		this.options = options
		this.warn = options.warn || noop
		this.transforms = pluckModuleFunction(options.modules, 'transformCode')
		this.dataGenFns = pluckModuleFunction(options.modules, 'genData')
		this.directives = extend(extend({}, baseDirectives), options.directives)
		const isReservedTag = options.isReservedTag || no
		this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag)
		this.onceId = 0
		this.staticRenderFns = []
		this.pre = false
	}
}

export function generate (ast, options) {
	const state = new CodegenState(options)
	const code = ast ? genElement(ast, state) : '_c("div")'
	return {
		render: `with(this){return ${code}}`,
		staticRenderFns: state.staticRenderFns
	}
}

function genElement (el, state) {
	if (el.parent) {
		el.pre = el.pre || el.parent.pre
	}
	
	if (el.if) {
		//指令及插槽和其他
	} else {
		//组件和基础元素
		let code
		if (el.component) {
			code = genComponent(el.component, el, state)
		}else {
			let data
			if (!el.plain || (el.pre && state.maybeComponent(el))) {
				data = genData(el, state)
				console.log(data, el, 'data=============>')
			}
		}
	}
	
}

function genComponent (componentName, el, state) {
	const children = el.inlineTemplate ? null : genChildren(el, state, true)
	return `_c(${componentName},${genData(el, state)}${
		children ? `,${children}` : ''
	})`
}

function genChildren(el, state){

}

function genData(el, state = {}){
	console.log(state, 'state=///////////')
	debugger
	let data = '{'
	//指令优先
	const dirs = genDirectives(el, state)
	if (dirs) data += dirs + ','
	
	
	// key
	if (el.key) {
		data += `key:${el.key},`
	}
	// ref
	if (el.ref) {
		data += `ref:${el.ref},`
	}
	
	if (el.component) {
		data += `tag:"${el.tag}",`
	}
	
	for (let i = 0; i < state.dataGenFns?.length; i++) {
		data += state.dataGenFns[i](el)
	}
	debugger
	
	if (el.attrs) {
		data += `attrs:${genProps(el.attrs)},`
	}
	// DOM props
	if (el.props) {
		data += `domProps:${genProps(el.props)},`
	}
	
	if (el.events) {
		data += `${genHandlers(el.events, false)},`
	}
	if (el.nativeEvents) {
		data += `${genHandlers(el.nativeEvents, true)},`
	}
	
	if (el.slotTarget && !el.slotScope) {
		data += `slot:${el.slotTarget},`
	}
	
	if (el.scopedSlots) {
		data += `${genScopedSlots(el, el.scopedSlots, state)},`
	}
	
	if (el.model) {
		data += `model:{value:${
			el.model.value
		},callback:${
			el.model.callback
		},expression:${
			el.model.expression
		}},`
	}
	
	if (el.inlineTemplate) {
		const inlineTemplate = genInlineTemplate(el, state)
		if (inlineTemplate) {
			data += `${inlineTemplate},`
		}
	}
	
	data = data.replace(/,$/, '') + '}'
	if (el.dynamicAttrs) {
		data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`
	}
	// v-bind data wrap
	if (el.wrapData) {
		data = el.wrapData(data)
	}
	// v-on data wrap
	if (el.wrapListeners) {
		data = el.wrapListeners(data)
	}
	return data
}

function genProps(props){

}


function genDirectives(el, state ){
	const dirs = el.directives
	if (!dirs) return
	let res = 'directives:['
	let hasRuntime = false
	let i, l, dir, needRuntime
	for (i = 0, l = dirs.length; i < l; i++) {
		dir = dirs[i]
		needRuntime = true
		const gen = state.directives[dir.name]
		if (gen) {
			// compile-time directive that manipulates AST.
			// returns true if it also needs a runtime counterpart.
			needRuntime = !!gen(el, dir, state.warn)
		}
		if (needRuntime) {
			hasRuntime = true
			res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
				dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
			}${
				dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
			}${
				dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
			}},`
		}
	}
	if (hasRuntime) {
		return res.slice(0, -1) + ']'
	}
}
