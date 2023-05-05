import { validateProp } from '../util/props'
import { defineReactive, observe, toggleObserving } from '../observer'
import { bind, hasOwn, isPlainObject, noop } from '../util/share'
import { isReserved } from '../util/lang'

export function initState(vm){
	vm._watchers = []
	const opts = vm.$options
	
	if(opts.props){
		initProps(vm, opts.props)
	}
	if(opts.methods){
		initMethods(vm, opts.methods)
	}
	if(opts.data){
		initData(vm)
	}else {
		observe( vm._data = {}, true /* asRootData */)
	}
	
	
}


function initProps(vm, propsOptions){
	const propsData = vm.$options.propsData || {}
	const props = vm._props = {}
	
	const keys = vm.$options._propKeys = []
	const isRoot = !vm.$parent
	
	//只监测最初的值
	if(!isRoot){
		toggleObserving(false)
	}
	for(let key in propsOptions){
	    keys.push(key)
		const value = validateProp(key, propsOptions, propsData, vm)
		defineReactive(props, key, value)
		if (!(key in vm)) {
			proxy(vm, `_props`, key)
		}
	}
	toggleObserving(true)
}

function initMethods(vm, methods){
	//需要监测方法名是否和prop重复
	const props = vm.$options.props
	for(const key in methods){
		if(typeof methods[key] !== 'function'){
			new Error(`方法${key}不是一个函数`)
		}
		if(props && hasOwn(props, key)){
			new Error('方法名和prop属性重复了')
		}
		if((key in vm) && isReserved(key)){
			new Error('方法名和vue中已存在的方法名重复了，避免定义的方法以_或者$开头')
		}
		//绑定方法内部的this
		vm[key] = typeof methods[key] !== 'function'? noop : bind(methods[key], vm)
	}
}

function initData(vm){
	let data = vm.$options.data
	data = vm._data = typeof data === 'function' ? getData(vm, data) : data || {}
	//data必须为对象
	if(!isPlainObject(data)){
		data = {}
		new Error('data必须返回一个对象')
	}
	
	//监测methods和prop中是否有重复的key
	const keys = Object.keys(data)
	const props = vm.$options.props
	const methods = vm.$options.methods
	for(let i = 0, length = keys.length; i < length; i++){
	    const key = keys[i]
		if(methods && hasOwn(methods, key)){
			new Error('方法名重复了')
		}
		if(props && hasOwn(props, key)){
			new Error('prop属性重复了')
		}
		if(!isReserved(key)){
			//把属性代理到vm上
			proxy(vm, '_data', key)
		}
	}
	
	observe(data, true)
	
}


function initComputed(vm, computed){

}
function initWatch(vm, watch){

}


function getData(vm, data){
	data.call(vm, vm)
}

/*
* 把key 从sourceKey上代理到target目标对象上
* */
export function proxy(target, sourceKey, key){
	Object.defineProperty(target, key,{
		enumerable: true,
		configurable: true,
		get: function (){
			return this[sourceKey][key]
		},
		set: function(val){
			this[sourceKey][key] = val
		}
	})
}
