const _toString = Object.prototype.toString

export function isPlainObject (obj) {
	return _toString.call(obj) === '[object Object]'
}

// gq-op => gqOp
const camelizeRE = /-(\w)/g
export const camelize = cached(str => {
	return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

//像对象添加属性
export function extend (to, _from) {
	for (const key in _from) {
		to[key] = _from[key]
	}
	return to
}

export function cached (fn) {
	const cache = Object.create(null)
	return (function cachedFn (str) {
		const hit = cache[str]
		return hit || (cache[str] = fn(str))
	})
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export function hasOwn (obj, key) {
	return hasOwnProperty.call(obj, key)
}

export function isUndef (v) {
	return v === undefined || v === null
}

export function isTrue (v) {
	return v === true
}

export function isDef (v) {
	return v !== undefined && v !== null
}

export function isPromise (val) {
	return (
		isDef(val) &&
		typeof val.then === 'function' &&
		typeof val.catch === 'function'
	)
}

export function toArray (list, start) {
	start = start || 0
	let i = list.length - start
	const ret = new Array(i)
	while (i--) {
		ret[i] = list[i + start]
	}
	return ret
}

export const emptyObject = Object.freeze({})

const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str) => {
	return str.replace(hyphenateRE, '-$1').toLowerCase()
})

//空函数
export function noop (a, b, c) {}

function polyfillBind (fn, ctx) {
	function boundFn (a) {
		const l = arguments.length
		return l
			? l > 1
				? fn.apply(ctx, arguments)
				: fn.call(ctx, a)
			: fn.call(ctx)
	}
	
	boundFn._length = fn.length
	return boundFn
}

function nativeBind (fn, ctx) {
	return fn.bind(ctx)
}

//兼容，有bind直接用，没有就用call或者apply改写
export const bind = Function.prototype.bind
	? nativeBind
	: polyfillBind

//删除数组中第一个匹配的元素
export function remove (arr, item) {
	if (arr.length) {
		const index = arr.indexOf(item)
		if (index > -1) {
			return arr.splice(index, 1)
		}
	}
}

export function makeMap (
	str,
	expectsLowerCase
) {
	const map = Object.create(null)
	const list = str.split(',')
	for (let i = 0; i < list.length; i++) {
		map[list[i]] = true
	}
	return expectsLowerCase
		? val => map[val.toLowerCase()]
		: val => map[val]
}

export const no = (a, b, c) => false

export const capitalize = cached(str => {
	return str.charAt(0).toUpperCase() + str.slice(1)
})



export function genStaticKeys (modules) {
	return modules.reduce((keys, m) => {
		return keys.concat(m.staticKeys || [])
	}, []).join(',')
}

