import { cached, isTrue, isUndef } from '../../util/share'
import { invokeWithErrorHandling } from '../../util/error'

export function updateListeners(on, oldOn, add, remove, createOnceHandler, vm){
	let name, def, cur, old, event
	for(name in on){
		def = cur = on[name]
		old = oldOn[name]
		event = normalizeEvent(name)
		if(isUndef(old)){
			if (isUndef(cur.fns)) {
				cur = on[name] = createFnInvoker(cur, vm)
			}
			if (isTrue(event.once)) {
				cur = on[name] = createOnceHandler(event.name, cur, event.capture)
			}
			add(event.name, cur, event.capture, event.passive, event.params)
		} else if (cur !== old) {
			old.fns = cur
			on[name] = old
		}
	}
	for (name in oldOn) {
		if (isUndef(on[name])) {
			event = normalizeEvent(name)
			remove(event.name, oldOn[name], event.capture)
		}
	}
	
}


const normalizeEvent = cached(name => {
	const passive = name.charAt(0) === '&'
	name = passive ? name.slice(1) : name
	const once = name.charAt(0) === '~' // Prefixed last, checked first
	name = once ? name.slice(1) : name
	const capture = name.charAt(0) === '!'
	name = capture ? name.slice(1) : name
	return {
		name,
		once,
		capture,
		passive
	}
})

export function createFnInvoker (fns, vm){
	function invoker () {
		const fns = invoker.fns
		if (Array.isArray(fns)) {
			const cloned = fns.slice()
			for (let i = 0; i < cloned.length; i++) {
				invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`)
			}
		} else {
			// return handler return value for single handlers
			return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`)
		}
	}
	invoker.fns = fns
	return invoker
}
