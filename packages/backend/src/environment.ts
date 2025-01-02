import { bool, cleanEnv, str } from 'envalid'

export const env = cleanEnv(process.env, {
	AWS_REGION: str({ default: 'ap-southeast-2' }),
	INPUT_BUCKET: str({ default: 'disco-uploads' }),
	OUTPUT_BUCKET: str({ default: 'disco-downloads' }),
	USE_S3: bool({ default: true }),
})
