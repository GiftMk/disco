/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'uploadDetails': { name: 'uploadDetails'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'UploadDetails'; ofType: null; }; } }; }; };
    'String': unknown;
    'UploadDetails': { kind: 'OBJECT'; name: 'UploadDetails'; fields: { 'audioFilename': { name: 'audioFilename'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'audioUploadUrl': { name: 'audioUploadUrl'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'imageFilename': { name: 'imageFilename'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'imageUploadUrl': { name: 'imageUploadUrl'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'UploadDetailsInput': { kind: 'INPUT_OBJECT'; name: 'UploadDetailsInput'; isOneOf: false; inputFields: [{ name: 'audioExtension'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }, { name: 'imageExtension'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; }; defaultValue: null }]; };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: never;
  subscription: never;
  types: introspection_types;
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}