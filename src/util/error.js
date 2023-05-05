import { isPromise } from './share'

export function invokeWithErrorHandling (
	handler,
	context,
	args,
	vm,
	info
) {
	let res
	try {
		res = args ? handler.apply(context, args) : handler.call(context)
		if (res && !res._isVue && isPromise(res)) {
			res = res.catch(e => handleError(e, vm, info + ` (Promise/async)`))
		}
	} catch (e) {
		handleError(e, vm, info)
	}
	return res
}

function handleError(err, vm, info){

}
