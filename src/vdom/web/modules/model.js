import { createASTElement } from '../../../compiler/parser'
import { getAndRemoveAttr, getBindingAttr } from '../../../compiler/helpers'

function preTransformNode(el, options){
	if(el.tag === 'input'){
		const map = el.attrsMap
		if(!map['v-model']){
			return
		}
		
		let typeBinding
		if(map[':type']||map['v-bind:type']){
			typeBinding = getBindingAttr(el, 'type')
		}
		if(!map.type && !typeBinding && map['v-bind']){
			typeBinding = `(${map['v-bind']}).type`
		}
		
		
		if(typeBinding){
			const ifCondition = getAndRemoveAttr(el, 'v-if', true)
			const ifConditionExtra = ifCondition ? `&&(${ifCondition})` : ''
			const hasElse = getAndRemoveAttr(el, 'v-else', true) != null
			const elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true)
			
		}
	}
}

function cloneASTElement(el){
	return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

export default {
	preTransformNode
}
