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
  usePagination,
  Row,
} from 'react-table';
import { formatDistanceToNow } from 'date-fns';
import { matchSorter } from 'match-sorter';

export interface TableColumn {
  Header: string;
  accessor: string;
}

export type TableData = Record<string, string>;

export interface TableProps {
  columns: TableColumn[];
  data: TableData[];
  warnings?: Warnings;
}

type RowWarningSeverity = 'none' | 'info' | 'low' | 'high';
export interface RowWarning {
  severity: RowWarningSeverity;
  message: string;
}

export interface RowWarnings {
  rows: RowWarning[];
  attachedColumn?: string;
}

export interface Warnings {
  rowWarnings?: RowWarnings;
}

import '../styles/table.css';

const supabaseDateTimeRegex = new RegExp(
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{6})?(Z|\+\d{2}:\d{2})?/
);

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

type DateFormat = 'TZ' | 'baseString' | 'localString' | 'since';
interface DateFormatOption {
  value: DateFormat;
  label: string;
}
const dateFormats: DateFormatOption[] = [
  { value: 'TZ', label: 'Time Zone' },
  { value: 'baseString', label: 'Basic String' },
  { value: 'localString', label: 'Local String' },
  { value: 'since', label: 'Time Since' },
];

function formatDate(date: string, dateFormat: DateFormat) {
  if (!supabaseDateTimeRegex.test(date)) return date;
  switch (dateFormat) {
    case 'since':
      return formatDistanceToNow(new Date(date), { addSuffix: true });

    case 'localString':
      return new Date(date).toLocaleString();

    case 'baseString':
      return new Date(date).toString();

    case 'TZ':
    default:
      return new Date(date).toISOString();
  }
}

function formatDates(dateFormat: DateFormat): void {
  const dateCells = document.getElementsByClassName('date-cell');
  if (dateCells.length === 0) {
    createFormattedDates();
    return formatDates(dateFormat);
  }
  for (let i = 0; i < dateCells.length; i++) {
    const dateCell = dateCells[i];
    const dateOriginal = dateCell.getElementsByClassName('date-original')[0];
    const dateFormatted = dateCell.getElementsByClassName('date-formatted')[0];
    if (!dateOriginal || !dateFormatted || !dateOriginal.textContent) continue;
    dateFormatted.textContent = formatDate(dateOriginal.textContent, dateFormat);
  }
}

function createFormattedDates() {
  const tds = document.getElementsByClassName('td');
  for (let i = 0; i < tds.length; i++) {
    const td = tds[i];
    const text = td.textContent;
    if (!text) continue;
    if (supabaseDateTimeRegex.test(text)) {
      td.classList.add('date-cell');
      td.textContent = '';
      const { dateOriginal, dateFormatted } = createDateItem(text);
      td.append(dateOriginal);
      td.append(dateFormatted);
    }
  }
}

function createDateItem(date: string) {
  const dateOriginal = document.createElement('div');
  dateOriginal.className = 'date-original';
  dateOriginal.textContent = date;

  const dateFormatted = document.createElement('div');
  dateFormatted.className = 'date-formatted';
  dateFormatted.textContent = date;

  return { dateOriginal, dateFormatted };
}

export default function Table({ columns, data, warnings }: TableProps) {
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

  // TODO: Investigate why these are throwing errors and how to properly fix it
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    allColumns,
    // @ts-ignore
    page,
    // @ts-ignore
    canPreviousPage,
    // @ts-ignore
    canNextPage,
    // @ts-ignore
    pageOptions,
    // @ts-ignore
    pageCount,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    nextPage,
    // @ts-ignore
    previousPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    selectedFlatRows,
    // @ts-ignore
    state: { pageIndex, pageSize, selectedRowIds },
    initialState,
  } = useTable(
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
    usePagination,
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

  // TODO: Investigate why this is throwing an error and how to properly fix it
  // @ts-ignore
  initialState.pageSize = 100;

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
          Date Format:
          <select
            id="date-format"
            onChange={(e) => {
              const dateFormat = e.target.value;
              formatDates(dateFormat as DateFormat);
            }}
          >
            {dateFormats.map((dateFormat) => {
              return (
                <option key={dateFormat.value} value={dateFormat.value}>
                  {dateFormat.label}
                </option>
              );
            })}
          </select>
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
          {page.map((row: Row<TableData>) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr">
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps(cellProps)} className="td">
                      {cell.render('Cell')}
                      {cell.column.id === warnings?.rowWarnings?.attachedColumn ? (
                        warnings.rowWarnings.rows[cell.row.index].severity !== 'none' ? (
                          <div className="warning">
                            <img
                              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nO2UTQ7BQABG30LZs5EgrmCJlAV34QL+TuTvGm4gYYFLILZGJplJRrXTqY6dl3xJM9O+bzrTFP54pAVcgLO69koB2ANC5QAEPgumhlxn4kteBa4xBTeg5qNgFSPXWeaV94GnpUBm8K08UIdpyrpAGBn7+sBnMavVRMflR5CJOnDPUPAAmlkKNgn7rYmbW+PI0HKgIdCzzMtnrRSBY8pXIyw5ASVbwSKHXKjMk+SNhIMVRspAJeWeu3J9sHVYXcWhQCjXGx0PWyMiaZsF4x8UjMwC+do7h/+OcMhTuaTzD6m8AGIz0rRb3H6FAAAAAElFTkSuQmCC"
                              alt={warnings.rowWarnings.rows[cell.row.index].message}
                              title={warnings.rowWarnings.rows[cell.row.index].message}
                            ></img>
                          </div>
                        ) : null
                      ) : null}
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
          ? `Showing the first 100 results of ${page.length} found in all ${data.length} rows`
          : `Found ${page.length} results in all ${data.length} rows`}
      </div>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        <span>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        {pageOptions.length > 1 && (
          <span>
            | Go to page:
            <input
              type="number"
              defaultValue={pageIndex + 1}
              min={1}
              max={pageOptions.length}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: `${pageOptions.length.toString().length * 0.6 + 1.2}em` }}
            />
          </span>
        )}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50, 100, 200, 500, 1000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
