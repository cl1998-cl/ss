
import modules from '../modules/index'
import directives from '../../modules/directives'
import { genStaticKeys } from '../../../util/share'
import { getTagNamespace, isPreTag, isReservedTag } from '../util/element'
import { mustUseProp } from '../util/attrs'
import { canBeLeftOpenTag, isUnaryTag } from './util'



export const baseOptions = {
	exceptHTML: true,
	modules,
	directives,
	isPreTag,
	isUnaryTag,
	mustUseProp,
	canBeLeftOpenTag,
	isReservedTag,
	getTagNamespace,
	staticKeys: genStaticKeys(modules)
}
