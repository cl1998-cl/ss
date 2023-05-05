import { VNode } from '../vnode'
import { isDef, isTrue, isUndef, remove } from '../../util/share'
import { createFnInvoker } from './updateListeners'

export function mergeVNodeHook(def, hookKey, hook){
	if(def instanceof  VNode){
		def = def.data.hook || (def.data.hook = {})
	}
	
	let invoker
	const oldHook = def[hookKey]
	
	function wrappedHook(){
		hook.apply(this, arguments)
		remove(invoker.fns, wrappedHook)
	}
	
	if(isUndef(oldHook)){
		invoker = createFnInvoker([wrappedHook])
	}else {
		if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
			// already a merged invoker
			invoker = oldHook
			invoker.fns.push(wrappedHook)
		} else {
			// existing plain hook
			invoker = createFnInvoker([oldHook, wrappedHook])
		}
	}
}
