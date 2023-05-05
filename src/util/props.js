import { hasOwn, hyphenate, isPlainObject } from './share'
import { observe, shouldObserve, toggleObserving } from '../observer'


//获取默认值
export function validateProp(key, propsOptions, propsData, vm){
	const prop = propsOptions[key]
	const absent = !hasOwn(propsData, key)
	let value = propsData[key]
	
	//判断是不是布尔类型，布尔类型特殊处理
	const booleanIndex = getTypeIndex(Boolean, prop.type)
	if(booleanIndex > -1){
		//没有默认值，没传就是false
		if (absent && !hasOwn(prop, 'default')) {
			value = false
		} else if (value === '' || value === hyphenate(key)) {
			//传了
			const stringIndex = getTypeIndex(String, prop.type)
			if (stringIndex < 0 || booleanIndex < stringIndex) {
				value = true
			}
		}
	}
	
	//
	if(value === undefined){
		value = getPropDefaultValue(vm, prop, key)
		
		//给prop添加监测
		const prevShouldObserve = shouldObserve
		toggleObserving(true)
		observe(value)
		toggleObserving(prevShouldObserve)
	}
	return value
}

/*
* @param a, b
* 判断b中是否有a类型
* @return 没有返回-1  有则大于-1
* */
function getTypeIndex(type, exceptedTypes){
	if(!Array.isArray(exceptedTypes)){
		return isSameType(type, exceptedTypes) ? 0 : -1
	}
	let length = exceptedTypes.length
	for(let i = 0; i < length; i++){
		if(isSameType(type, exceptedTypes[i])){
			return i
		}
	}
	return -1
}
function isSameType(a, b){
	return getType(a) === getType(b)
}
function getType (fn) {
	const match = fn && fn.toString().match(/^\s*function (\w+)/)
	return match ? match[1] : ''
}

/*
* 获取prop的默认值
* */
function getPropDefaultValue(vm, prop, key){
	//没有默认值返回undefined
	if(!hasOwn(prop, 'default')){
		return undefined
	}
	const def = prop.default
	if(isPlainObject(def)){
		new Error('复杂数据类型的默认必须通过函数返回')
	}
	if(vm
		&& vm.$options.propsData
		&& vm.$options.propsData[key] === undefined
		&& vm._props[key] !== undefined
	){
		return vm._props[key]
	}
	
	//默认值default可能为函数
	return typeof def === 'function' && getType(prop.type) !== 'Function'
		? def.call(vm)
		: def
}
