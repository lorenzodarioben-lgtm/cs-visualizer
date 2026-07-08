export type LinkedListOperation = 'insert-head' | 'insert-tail' | 'insert-index' | 'delete-value' | 'delete-index' | 'search' | 'reverse';

export type LinkedListStep = {
  id: string;
  operation: LinkedListOperation;
  description: string;
  codeLine?: number;
  list: number[];
  currentIndex?: number;
  previousIndex?: number;
  targetIndex?: number;
  result?: number | boolean | null;
  warning?: string;
};
