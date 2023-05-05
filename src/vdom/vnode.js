



export class VNode{
	tag;
	data;
	children;
	text;
	elm;
	ns;
	context;
	key;
	componentOptions;
	componentInstance;
	parent;
	
	raw;
	isStatic;
	isRootInsert;
	isComment;
	isCloned;
	isOnce;
	asyncFactory;
	asyncMeta;
	isAsyncPlaceholder;
	ssrContext;
	fnContext;
	fnOptions;
	devtoolsMeta;
	fnScopeId;
	
	constructor (tag, data, children, text, elm, context, componentOptions, asyncFactory) {
		this.tag = tag
		this.data = data
		this.children = children
		this.text = text
		this.elm = elm
		this.ns = undefined
		this.context = context
		this.fnContext = undefined
		this.fnOptions = undefined
		this.fnScopeId = undefined
		this.key = data && data.key
		this.componentOptions = componentOptions
		this.componentInstance = undefined
		this.parent = undefined
		this.raw = false
		this.isStatic = false
		this.isRootInsert = false
		this.isComment = false
		this.isCloned = false
		this.isOnce = false
		this.asyncFactory = asyncFactory
		this.asyncMeta = undefined
		this.isAsyncPlaceholder = false
	}
	get child(){
		return this.componentInstance
	}
	
}

export function createEmptyVNode(text = ''){
	const node = new VNode()
	node.text = text
	node.isComment = true
	return node
}
