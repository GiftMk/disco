import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
	schema: 'schema.graphql',
	generates: {
		'./src/generated/graphql.ts': {
			config: {
				useIndexSignature: true,
				useTypeImports: true,
			},
			plugins: ['typescript', 'typescript-resolvers'],
		},
	},
}
export default config
