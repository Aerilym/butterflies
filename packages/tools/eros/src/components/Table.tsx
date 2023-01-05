import React, { ForwardRefExoticComponent, MutableRefObject, useEffect } from 'react';
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect,
  HeaderPropGetter,
  RowPropGetter,
  HeaderGroup,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from 'react-table';

import { matchSorter } from 'match-sorter';

export interface TableColumn {
  Header: string;
  accessor: string;
}

export type TableData = Record<string, string>;

export interface TableProps {
  columns: TableColumn[];
  data: TableData[];
}

import '../styles/table.css';

// TODO: Work out the proper typing, forcing type any works but is sloppy
const getStyles = (props: any, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
];

// TODO: Work out the proper typing, forcing type any works but is sloppy
const headerProps = (props: HeaderPropGetter<TableData>, { column }: any) =>
  getStyles(props, column.align);

// TODO: Work out the proper typing, forcing type any works but is sloppy
const cellProps = (props: RowPropGetter<TableData>, { cell }: any) =>
  getStyles(props, cell.column.align);

const IndeterminateCheckbox: ForwardRefExoticComponent<{ indeterminate: boolean }> =
  React.forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef<HTMLInputElement>();
    const resolvedRef =
      (ref as MutableRefObject<HTMLInputElement>) ||
      (defaultRef as MutableRefObject<HTMLInputElement>);

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef as React.Ref<HTMLInputElement> | MutableRefObject<HTMLInputElement>}
          {...rest}
        />
      </>
    );
  });

// Define a default UI for filtering
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }: any) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row: { values: { [x: string]: string } }) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option: any, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
function SliderColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }: any) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: { values: { [x: string]: number } }) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}: any) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: { values: { [x: string]: number } }) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem',
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem',
        }}
      />
    </div>
  );
}

function fuzzyTextFilterFn(rows: any, id: any, filterValue: any) {
  return matchSorter(rows, filterValue, { keys: [(row: any) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val;

// TODO: Investigate adding the filterGreaterThan function back in
/* 
// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== 'number'; */

export default function Table({ columns, data }: TableProps) {
  const [showVisibilityMenu, setShowVisibilityMenu] = React.useState<boolean>(false);
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any[], id: string | number, filterValue: any) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 300, // maxWidth is only used as a limit for resizing
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, allColumns } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // TODO: Investigate why this is throwing an error and how to properly fix it
      // @ts-ignore
      filterTypes,
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: 'selection',
          disableResizing: true,
          minWidth: 35,
          width: 35,
          maxWidth: 35,
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }: any) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }: any) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
      hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
        // fix the parent group of the selection button to not be resizable
        // TODO: Work out the proper typing, forcing type to add canResize isn't great.
        const selectionGroupHeader = headerGroups[0].headers[0] as HeaderGroup<TableData> & {
          canResize: boolean;
        };
        selectionGroupHeader.canResize = false;
      });
    }
  );

  let firstPageRows = rows.slice(0, 100);

  return (
    <div className="table-container">
      <div {...getTableProps()} className="table">
        <div className="table-controls">
          <button
            onClick={() => {
              setShowVisibilityMenu(!showVisibilityMenu);
            }}
          >
            Column Visibility
          </button>
        </div>
        {showVisibilityMenu && (
          <div className="visibility-menu">
            {/* TODO: Fix issue where an error is thrown when all columns are gone and you activate the menu */}
            {/* <div>
              <IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
            </div> */}
            <div className="individual-visibility-menu">
              {allColumns.map((column) => (
                <div key={column.id}>
                  <label>
                    <input type="checkbox" {...column.getToggleHiddenProps()} /> {column.id}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          {headerGroups.map((headerGroup) => (
            <div
              {...headerGroup.getHeaderGroupProps({
                // style: { paddingRight: '15px' },
              })}
              className="tr"
            >
              {/* TODO: Work out the proper typing, forcing type any works but is sloppy*/}
              {headerGroup.headers.map((column: any) => (
                <div {...column.getHeaderProps()} className="th">
                  {/* <input
                    type="checkbox"
                    id={column.id + 'checkbox'}
                    className="column-hider"
                    {...column.getToggleHiddenProps()}
                  /> */}
                  <button
                    className="column-hider"
                    {...column.getToggleHiddenProps()}
                    onClick={() => {
                      column.toggleHidden();
                    }}
                  >
                    <img
                      className="eye eye-open"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABH0lEQVR4nO2UvU5CQRCFv4poxELFzkIT8TVAan9ewehDGJFefBsE30ILLbil2lzt4QEwk5xCNzOXxcJQ8CWT3MycM7uZ3buwYtnZBq6AIVAAU0Wh3KU0C7MO9NRsNidMcytPFnvAc0bjWRKvwMG85kfAl2MeAC1gQ9HWiFKdeZtR813gwzFdV2yo6+jfgYYnfgx2btSAe+ATKIG+csbI8T2QcB7MtaV636lZzjgOvKc/FygCUV310qlZztgMvON/XeAsELUrRnSnWifwnqTn4F27oWo1LVI6h1x1OX7R0BVLxV1ieo7+DdiJDM3gRxvpttQVnWDn5j0k46l4+sNT8QLsk8maRjPNaDwBbuRZmC3gQoc2VrOJvgeqmWbFEvMNriXJVcp1zQIAAAAASUVORK5CYII="
                    />
                    <img
                      className="eye eye-closed"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAABQ0lEQVR4nO3UMUtcURAF4M8tJHaCgiliJNjERiwSi5A/IRohKdJa6t8waUST/AiTSq1Mo4goGLBaqxjQ2mihy5IYePJkEi4Lu/vY7MIWe+DA5c7cc96dufPoodsxggVsoIyfuIz1ZsQetiI8iPeoImvCauTmZwphEt8LCGc1PMPzZuJTUYKsRd7gZT3xx7j4D/EsmPdprFa8D7ttEM+Ce6H5D/NtFM+Cr1ODww4YfEsNjjpgcJwavInNP1jGxxikcgGhk8j9hHe4jf23tU3ej8AWSklspYH4WpJXCqMsSp5q3ONJMgNfMJDEZrAT77wSL242iT/Aepy9wni9WXiB60g8wITmeJrcvtJo0P7iWYx9FvX8jFcYRX8wX8/FV/+O3HNMK4ghrOJXgSbnBh8wrAU8wiK2cRp/zpw/8BVLcZseuhh3OoHcHMUbMBYAAAAASUVORK5CYII="
                    />
                  </button>
                  <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                    {column.render('Header')}
                  </div>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>

                  {/* Use column.getResizerProps to hook up the events correctly */}
                  {column.canResize && (
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="tbody">
          {firstPageRows.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps(cellProps)} className="td">
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="showing-results">
        {data.length > 100
          ? `Showing the first 100 results of ${rows.length} found in all ${data.length} rows`
          : `Found ${rows.length} results in all ${data.length} rows`}
      </div>
    </div>
  );
}
