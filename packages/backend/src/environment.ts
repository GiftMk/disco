import 'dotenv/config'
import { cleanEnv, str } from 'envalid'
import os from 'node:os'

export const env = cleanEnv(process.env, {
	AWS_REGION: str({ default: 'ap-southeast-2' }),
	INPUT_BUCKET: str({ default: 'disco-uploads' }),
	OUTPUT_BUCKET: str({ default: 'disco-downloads' }),
	TEMP_DIR_ROOT: str({ default: os.tmpdir() }),
})
