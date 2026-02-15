import Root from './root.svelte';
import Header from './header.svelte';
import Body from './body.svelte';
import Row from './row.svelte';
import HeaderCell from './header-cell.svelte';
import Cell from './cell.svelte';

export { createTableSort } from './sort.svelte.js';

export const Table = {
    Root,
    Header,
    Body,
    Row,
    HeaderCell,
    Cell
};
