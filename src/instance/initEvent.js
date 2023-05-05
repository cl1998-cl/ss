import { updateListeners } from '../vdom/helper/updateListeners'
import { toArray } from '../util/share'
import { invokeWithErrorHandling } from '../util/error'

export function initEvents(vm){
	vm._events = {}
	vm._hasHookEvent = false
	
	const listeners = vm.$options._parentListeners
	if(listeners){
		updateComponentListeners(vm, listeners)
	}
}

let target

function updateComponentListeners(vm, listeners, oldListeners){
	target = vm
	updateListeners(listeners, oldListeners||{}, add, remove, createOnceHandler, vm)
	target = undefined
}

function add(event, fn){
	target.$on(event, fn)
}
function remove(event, fn){
	target.$off(event, fn)
}
function createOnceHandler(event, fn){
	const _target = target
	return function onceHandler () {
		const res = fn.apply(null, arguments)
		if (res !== null) {
			_target.$off(event, onceHandler)
		}
	}
}

const hookRE = /^hook:/
export function $on(event, fn){
	const vm = this
	if(Array.isArray(event)){
		for (let i = 0, l = event.length; i < l; i++) {
			vm.$on(event[i], fn)
		}
	}else {
		(vm._events[event] || (vm._events[event] = [])).push(fn)
		if(hookRE.test(event)){
			vm._hasHookEvent = true
		}
	}
	return vm
}
export function $off(event, fn){
	const vm = this
	if(!arguments.length){
		vm._events = {}
		return vm
	}
	if (Array.isArray(event)) {
		for (let i = 0, l = event.length; i < l; i++) {
			vm.$off(event[i], fn)
		}
		return vm
	}
	const cbs = vm._events[event]
	if (!cbs) {
		return vm
	}
	if (!fn) {
		vm._events[event] = null
		return vm
	}
	// specific handler
	let cb
	let i = cbs.length
	while (i--) {
		cb = cbs[i]
		if (cb === fn || cb.fn === fn) {
			cbs.splice(i, 1)
			break
		}
	}
	return vm
}

export function $once(event, fn){
	const vm = this
	function on(){
		vm.$off(event, on)
		fn.apply(vm, arguments)
	}
	on.fn = fn
	vm.$on(event, on)
	return vm
}

export function $emit(event){
	const vm = this
	
	let cbs = vm._events[event]
	if(cbs){
		cbs = cbs.length > 1 ? toArray(cbs) : cbs
		const args = toArray(arguments, 1)
		const info = `event handler`
		for (let i = 0, l = cbs.length; i < l; i++) {
			invokeWithErrorHandling(cbs[i], vm, args, vm, info)
		}
	}
	return vm
}
