export default interface WindowState {
  windowMap:  Map<number, string | null>;
  addWindowNode: (parentId: number, path: string) => void
  delWindowNode: (id: number) => void
  clearWindows: () => void
}
