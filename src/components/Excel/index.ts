import { withInstall } from '/@/utils'
import impExcel from './src/ImportExcel.vue'
import expExcelModal from './src/ExportExcelModal.vue'
import impSimpleExcel from './src/ImportSimpleExcel.vue'

export const ImpExcel = withInstall(impExcel)
export const ExpExcelModal = withInstall(expExcelModal)
export const ImpSimpleExcel = withInstall(impSimpleExcel)
export * from './src/typing'
export { jsonToSheetXlsx, aoaToSheetXlsx } from './src/Export2Excel'
