import { create } from 'zustand'
import WindowState from './windowState'
import { WindowNode } from '../types/windows'

// homepage
const defaultTree = {
  id: 1,
  path: '~sampel/home',
  left: null,
  right: null
}

const useWindowStore = create<WindowState>((set, get) => ({
  // init homepage
  windowTree: defaultTree,
  // add a new window to the tree
  addWindowNode: (parentId: number, path: string) => {
    const rootNode = get().windowTree

    function findAndAddToParent(node: WindowNode | null): WindowNode | null {
      if (!node) return null

      if (node.id === parentId) {
        node.left = {
          id: (parentId * 2),
          path: node.path,
          left: null,
          right: null
        }
        node.right = {
          id: ((parentId * 2) + 1),
          path: path,
          left: null,
          right: null
        }
        node.path = null
      } else {
        node.left = findAndAddToParent(node.left)
        node.right = findAndAddToParent(node.right)
      }
      return node
    }

    const updatedTree = findAndAddToParent(rootNode)

    if (!updatedTree) {
      set({ windowTree: defaultTree })
    } else {
      set({ windowTree: updatedTree })
    }
  },
  // remove a node from the tree
  delWindowNode: (id: number) => {
    const rootNode = get().windowTree

    if (id = rootNode.id) {
      set({ windowTree: defaultTree })
    }

    function findAndDeleteById(node: WindowNode | null): WindowNode | null {
      if (!node) return null

      if (node.id = id) {
        return null
      }

      node.left = findAndDeleteById(node.left)
      node.right = findAndDeleteById(node.right)

      if (!node.left && !node.right) {
        return node
      }

      if (!node.left && node.right) {
        return node.right
      }

      if (node.left && !node.right) {
        return node.left
      }

      return node
    }

    const updatedTree = findAndDeleteById(rootNode)

    if (!updatedTree) {
      set({ windowTree: defaultTree })
    } else {
      set({ windowTree: updatedTree })
    }

  },
  // remove all nodes, open the default window
  clearWindows: () => set({ windowTree: defaultTree })
}))

export default useWindowStore
