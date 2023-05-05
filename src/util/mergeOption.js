import { camelize, extend, hasOwn, isPlainObject } from './share'
import config from '../config'


const strats = config.optionMergeStrategies

//默认子优先
const defaultStrat = function (parentVal, childVal){
	return childVal === undefined
		? parentVal
		: childVal
}
export function mergeOptions(parent, child, vm){
	if(typeof child === 'function'){
		child = child.options
	}
	normalizeProps(child, vm)
	normalizeInject(child, vm)
	normalizeDirectives(child)
	
	if (!child._base) {
		if (child.extends) {
			parent = mergeOptions(parent, child.extends, vm)
		}
		if (child.mixins) {
			for (let i = 0, l = child.mixins.length; i < l; i++) {
				parent = mergeOptions(parent, child.mixins[i], vm)
			}
		}
	}
	
	const options = {}
	let key
	for(key in parent){
		mergeField(key)
	}
	for (key in child) {
		if (!hasOwn(parent, key)) {
			mergeField(key)
		}
	}
	function mergeField(key){
		const strat = strats[key] || defaultStrat
		options[key] = strat(parent[key], child[key], vm, key)
	}
	return options
}

/*
* 格式化props，变为{type: Number}格式
* */
function normalizeProps(options, vm){
	const props = options.props
	if(!props) return
	const res = {}
	let i, val, name
	if(Array.isArray(props)){
		i = props.length
		while(i--){
			val = props[i]
			if(typeof val === 'string'){
				name = camelize(val)
				res[name] = {type: null}
			}
		}
	}else if(isPlainObject(props)){
		for (const key in props) {
			val = props[key]
			name = camelize(key)
			res[name] = isPlainObject(val)
				? val
				: { type: val }
		}
	}
	options.props = res
}

//变为对象格式
function normalizeInject(options, vm){
	const inject = options.inject
	if(!inject) return
	const normalized = options.inject = {}
	if(Array.isArray(inject)){
		for (let i = 0; i < inject.length; i++) {
			normalized[inject[i]] = { from: inject[i] }
		}
	}else if(isPlainObject(inject)){
		for (const key in inject) {
			const val = inject[key]
			normalized[key] = isPlainObject(val)
				? extend({ from: key }, val)
				: { from: val }
		}
	}
}

//变为对象格式
function normalizeDirectives(options){
	const dirs = options.directives
	if(dirs){
		for (const key in dirs) {
			const def = dirs[key]
			if (typeof def === 'function') {
				dirs[key] = { bind: def, update: def }
			}
		}
	}
}
