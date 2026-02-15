export type SortDirection = 'asc' | 'desc';

export interface TableSortState {
	column: string;
	direction: SortDirection;
	toggle: (key: string) => void;
	apply: <T>(data: T[]) => T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Accessor = (item: any) => string | number;

interface TableSortOptions<K extends string> {
	column: NoInfer<K>;
	direction: SortDirection;
	columns: Record<K, Accessor>;
}

export function createTableSort<K extends string>(options: TableSortOptions<K>): TableSortState {
	let column = $state<string>(options.column);
	let direction = $state<SortDirection>(options.direction);

	function toggle(key: string) {
		if (column === key) {
			direction = direction === 'asc' ? 'desc' : 'asc';
		} else {
			column = key;
			direction = 'asc';
		}
	}

	function apply<T>(data: T[]): T[] {
		const accessor = (options.columns as Record<string, Accessor>)[column];
		if (!accessor) return data;

		const dir = direction === 'asc' ? 1 : -1;

		return data.toSorted((a, b) => {
			const valA = accessor(a);
			const valB = accessor(b);

			if (typeof valA === 'string' && typeof valB === 'string') {
				return dir * valA.localeCompare(valB);
			}
			return dir * (Number(valA) - Number(valB));
		});
	}

	return {
		get column() {
			return column;
		},
		get direction() {
			return direction;
		},
		toggle,
		apply
	};
}
