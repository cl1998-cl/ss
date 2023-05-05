import { camelize, capitalize, hasOwn } from './share'

export function resolveAsset(options, type, id, warnMissing){
	if(typeof id !== 'string') return
	
	const assets = options[type]
	if(hasOwn(assets, id)) return assets[id]
	
	const camelizedId = camelize(id)
	if(hasOwn(assets, camelizedId)) return assets[camelizedId]
	
	const PascalCaseId = capitalize(camelizedId)
	if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]

	return assets[id] || assets[camelizedId] || assets[PascalCaseId]
}
