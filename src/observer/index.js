import { hasOwn, isPlainObject } from '../util/share'
import { VNode } from '../vdom/vnode'
import { def } from '../util/lang'
import { Dep } from './dep'

export let shouldObserve = true

export function toggleObserving (value) {
	shouldObserve = value
}

export function observe (value, asRootData) {
	if (!isPlainObject(value) || value instanceof VNode) {
		return
	}
	let ob
	if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
		ob = value.__ob__
	} else if (
		shouldObserve &&
		(Array.isArray(value) || isPlainObject(value)) &&
		Object.isExtensible(value) &&
		!value._isVue) {
		ob = new Observer(value)
	}
	if (asRootData && ob) {
		ob.vmCount++
	}
	return ob
}

export function defineReactive (obj, key, val, customSetter, shallow) {
	const dep = new Dep()
	
	const prototype = Object.getOwnPropertyDescriptor(obj, key)
	if (prototype && prototype.configurable === false) {
		return
	}
	
	const getter = prototype && prototype.get
	const setter = prototype && prototype.set
	
	//没有get或者有set
	if ((!getter || setter) && arguments.length === 2) {
		val = obj[key]
	}
	
	let childOb = !shallow && observe(val)
	
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function () {
			const value = getter ? getter.call(obj) : val
			if(Dep.target){
				dep.depend()
				if(childOb){
					childOb.dep.depend()
					if(Array.isArray(value)){
						dependArray(value)
					}
				}
			}
			return value
		},
		set: function(newValue){
			const value = getter ? getter.call(obj) : val
			//值未发生实际变化，或者新值及旧值为NaN||Symbol
			if(newValue === value || (newValue !== newValue && value !== value)){
				return
			}
			
			if(customSetter){
				customSetter()
			}
			
			if(getter && !setter){
				return
			}
			
			if(setter){
				setter.call(obj, newValue)
			}else{
				val = newValue
			}
			
			childOb = !shallow && observe(newValue)
			dep.notify()
			
			
		}
	})
	
}

export class Observer {
	value
	dep
	vmCount
	
	constructor (value) {
		this.value = value
		this.dep = new Dep()
		this.vmCount = 0
		def(value, '__ob__', this)
		
		if (Array.isArray(value)) {
			this.observeArray(value)
		} else {
			this.walk(value)
		}
	}
	
	walk (obj) {
		const keys = Object.keys(obj)
		for (let i = 0, length = keys.length; i < length; i++) {
			defineReactive(obj, keys[i])
		}
	}
	
	observeArray (list) {
		for (let i = 0, length = list.length; i < length; i++) {
			observe(list[i])
		}
	}
}


function dependArray (value) {
	for (let i = 0, l = value.length; i < l; i++) {
		let e = value[i]
		e && e.__ob__ && e.__ob__.dep.depend()
		if (Array.isArray(e)) {
			dependArray(e)
		}
	}
}
