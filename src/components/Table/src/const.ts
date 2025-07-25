import componentSetting from '/@/settings/componentSetting'

const { table } = componentSetting

const {
  pageSizeOptions,
  defaultPageSize,
  fetchSetting,
  defaultSize,
  defaultSortFn,
  defaultFilterFn,
} = table

export const ROW_KEY = 'key'

// Optional display number per page;
export const PAGE_SIZE_OPTIONS = pageSizeOptions

// Number of items displayed per page
export const PAGE_SIZE = defaultPageSize

// Common interface field settings
export const FETCH_SETTING = fetchSetting

// Default Size
export const DEFAULT_SIZE = defaultSize

// Configure general sort function
export const DEFAULT_SORT_FN = defaultSortFn

export const DEFAULT_FILTER_FN = defaultFilterFn

//  Default layout of table cells
export const DEFAULT_ALIGN = 'center'
// export const DEFAULT_ALIGN = 'left'

export const INDEX_COLUMN_FLAG = 'INDEX'

export const ACTION_COLUMN_FLAG = 'ACTION'
