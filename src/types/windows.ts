export interface WindowProps {
	id: number,
	path: string | null
}
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

