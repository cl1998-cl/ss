import { parseFilters } from './parser/filter-parser'

export function pluckModuleFunction (
	modules,
	key
) {
	return modules
		? modules.map(m => m[key]).filter(_ => _)
		: []
}





export function getAndRemoveAttr(el, name, removeFromMap){
	let val
	if((val = el.attrsMap[name]) !== null){
		const list = el.attrsList
		for(let i = 0; i < list.length; i++){
			if (list[i].name === name) {
				list.splice(i, 1)
				break
			}
		}
	}
	if(removeFromMap){
		delete el.attrsMap[name]
	}
	return val
}


export function getBindingAttr(el, name, getStatic){
	const dynamicValue =
		getAndRemoveAttr(el, ':' + name) ||
		getAndRemoveAttr(el, 'v-bind:' + name)
	if (dynamicValue != null) {
		return parseFilters(dynamicValue)
	} else if (getStatic !== false) {
		const staticValue = getAndRemoveAttr(el, name)
		if (staticValue != null) {
			return JSON.stringify(staticValue)
		}
	}
}
