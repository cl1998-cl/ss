import { createEmptyVNode } from '../vdom/vnode'
import config from '../config'

export function initLifecycle (vm) {
	const options = vm.$options
	
	//找到当前组建的最近的父亲（非抽象组建）
	let parent = options.parent
	if (parent && !options.abstract) {
		while (parent.$options.abstract && parent.$parent) {
			parent = parent.$parent
		}
		parent.$children.push(vm)
	}
	
	vm.$parent = parent
	vm.$root = parent ? parent.$root : vm
	
	vm.$children = []
	vm.$refs = {}
	
	vm._watcher = null
	vm._inactive = null
	vm._directInactive = false
	vm._isMounted = false
	vm._isDestroyed = false
	vm._isBeingDestroyed = false
}


export function callHook(vm, hook){

}
export function mountComponent(vm, el,hydrating ){
	vm.$el = el
	if(!vm.$options.render){
		vm.$options.render = createEmptyVNode
	}
	callHook('beforeMount')
	let updateComponent
	if(config.performance){
		updateComponent = () => {
			console.log('占卜')
		}
	}else {
		updateComponent = () => {
			vm._update(vm._render(), hydrating)
		}
	}
}

export function _update(vnode, hydrating){
	const vm = this
	const prevEl = vm.$el
	const prevNode = vm._vnode
	const restoreActiveInstance = () => {}
	vm._vnode = vnode
	
	//上一次的虚拟节点， 若无则代表初始化，若有则是更新
	if(!prevNode){
		vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false)
	}else {
		vm.$el = vm.__patch__(prevNode, vnode)
	}
	
	restoreActiveInstance()
	if (prevEl) {
		prevEl.__vue__ = null
	}
	if (vm.$el) {
		vm.$el.__vue__ = vm
	}
	// if parent is an HOC, update its $el as well
	if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
		vm.$parent.$el = vm.$el
	}
}
