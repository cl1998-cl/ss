import { $emit, $off, $on, $once } from './instance/initEvent'

/*
* 目标 数据驱动视图， 模版编译， 异步更新等
* */

import { _init } from './instance/init'
import { query } from './util/platform'
import { _update, mountComponent } from './instance/initLifecycle'
import { patch } from './vdom/patch'
import { render } from './instance/initRender'
import { cached } from './util/share'
import { compileToFunctions } from './vdom/web/compiler'


class View{
	
	constructor (options) {
		this.init(options)
		
	}
	
	init(options){
		_init.call(this, options)
	}
	$on(event, fn){
		return $on(event, fn)
	}
	$off(event, fn){
		return $off(event, fn)
	}
	$emit(event){
		return $emit(event)
	}
	$once(event, fn){
		return $once(event, fn)
	}
	$mount(el, hydrating){
		el = query(el)
		return mountComponent(this, el,hydrating )
	}
	_update(vnode, hydrating){
		_update.call(this, vnode, hydrating)
	}
	__patch__(){
		return patch.call(this, )
	}
	_render(){
		return render().call(this)
	}
	
}


const mount = View.prototype.$mount
View.prototype.$mount = function (el, hydrating){
	el = el && query(el)
	const options = this.$options
	
	if(!options.render){
		let template = options.template
		if (template) {
			if (typeof template === 'string') {
				if (template.charAt(0) === '#') {
					template = idToTemplate(template)
				}
			} else if (template.nodeType) {
				template = template.innerHTML
			} else {
				return this
			}
		} else if (el) {
			template = getOuterHTML(el)
		}
		if (template) {
			const { render, staticRenderFns } = compileToFunctions(template, {
				outputSourceRange: true,
				shouldDecodeNewlines: false,
				shouldDecodeNewlinesForHref: false,
				delimiters: options.delimiters,
				comments: options.comments
			}, this)
			options.render = render
			options.staticRenderFns = staticRenderFns
		}
	}
	
	return mount.call(this, el, hydrating)
}

View.options = {
	components: {},
	directives: {},
	filters: {},
	_base: View
}

function getOuterHTML (el) {
	if (el.outerHTML) {
		return el.outerHTML
	} else {
		const container = document.createElement('div')
		container.appendChild(el.cloneNode(true))
		return container.innerHTML
	}
}
const idToTemplate = cached(id => {
	const el = query(id)
	return el && el.innerHTML
})
window.View = View
