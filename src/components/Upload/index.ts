import { withInstall } from '/@/utils'
import basicUpload from './src/BasicUpload.vue'
import uploadImage from './src/ImageUpload.vue'

export const BasicUpload = withInstall(basicUpload)
export const ImageUpload = withInstall(uploadImage)
