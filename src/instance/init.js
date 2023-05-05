import { mergeOptions } from '../util/mergeOption'
import { initLifecycle } from './initLifecycle'
import { initEvents } from './initEvent'
import { initRender } from './initRender'
import { initState } from './initState'

let uid = 0



export function _init(options){
	const vm = this
	
	vm._uid = uid++
	vm._isVue = true
	
	if(options && options._isComponent){
	
	}else {
		vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options, vm)
	}
	
	vm._renderProxy = vm
	
	vm._self = vm
	
	initLifecycle(vm)
	initEvents(vm)
	initRender(vm)
	//initInjections(vm)
	initState(vm)
	//initProvide
	//callHook('created')
	
	if(vm.$options.el){
		vm.$mount(vm.$options.el)
	}
	
}





function resolveConstructorOptions(Ctor){
	let options = Ctor.options
	if(Ctor.super){
		return {}
	}
	return options
}
