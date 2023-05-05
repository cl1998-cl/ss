import { emptyObject } from '../util/share'
import { createElement } from '../vdom/create-element'

export function initRender(vm){
	vm._vnode = null
	vm._staticTrees = null
	const options = vm.$options
	const parentVnode = vm.$vnode = options._parentVnode
	const renderContext = parentVnode && parentVnode.context
	//vm.$slots = resolveSlots(options._renderChildren, renderContext)
	vm.scopedSlots = emptyObject
	//tag, data, children, normalizationType, alwaysNormalize
	vm._c = (a,b,c,d) => createElement(vm, a,b,c,d,false)
	vm.$createElement = (a,b,c,d) => createElement(vm, a,b,c,d,true)
	
	const parentData = parentVnode && parentVnode.data
	// defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
	// defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
}

export function render(){
	const vm = this
	const { render, _parentVnode } = vm.$options
	let vnode
	vnode = render.call(vm._renderProxy, vm.$createElement)
	console.log('执行了_render')
	return vnode
}
