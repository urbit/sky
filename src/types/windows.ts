export interface WindowNode {
	id: number
	path: string | null
	left: WindowNode | null
	right: WindowNode | null
}

export interface WindowContainerProps {
	node: WindowNode,
	isVertical: boolean
}

