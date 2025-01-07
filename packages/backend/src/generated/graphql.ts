import type { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateVideoInput = {
  audioFilename: Scalars['String']['input'];
  enableAudioNormalisation?: InputMaybe<Scalars['Boolean']['input']>;
  imageFilename: Scalars['String']['input'];
  normaliseAudioSettings?: InputMaybe<NormaliseAudioSettings>;
};

export type CreateVideoPayload = {
  __typename?: 'CreateVideoPayload';
  trackingId: Scalars['ID']['output'];
};

export type CreateVideoResponse = CreateVideoPayload | Error;

export type CreatingVideoPayload = {
  __typename?: 'CreatingVideoPayload';
  outputFilename?: Maybe<Scalars['String']['output']>;
  percentageComplete: Scalars['Float']['output'];
};

export type CreatingVideoResponse = CreatingVideoPayload | Error;

export type Error = {
  __typename?: 'Error';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createVideo: CreateVideoResponse;
  normaliseAudio: NormaliseAudioResponse;
};


export type MutationCreateVideoArgs = {
  input: CreateVideoInput;
};


export type MutationNormaliseAudioArgs = {
  input: NormaliseAudioInput;
};

export type NormaliseAudioInput = {
  audioFilename: Scalars['String']['input'];
  settings?: InputMaybe<NormaliseAudioSettings>;
};

export type NormaliseAudioPayload = {
  __typename?: 'NormaliseAudioPayload';
  outputFilename: Scalars['String']['output'];
};

export type NormaliseAudioResponse = Error | NormaliseAudioPayload;

export type NormaliseAudioSettings = {
  integrated: Scalars['Float']['input'];
  loudnessRange: Scalars['Float']['input'];
  truePeak: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  ping: Scalars['String']['output'];
  uploadDetails: UploadDetailsResponse;
};


export type QueryUploadDetailsArgs = {
  input: UploadDetailsInput;
};

export type Subscription = {
  __typename?: 'Subscription';
  creatingVideo: CreatingVideoResponse;
};


export type SubscriptionCreatingVideoArgs = {
  trackingId: Scalars['ID']['input'];
};

export type UploadDetailsInput = {
  audioExtension: Scalars['String']['input'];
  imageExtension: Scalars['String']['input'];
};

export type UploadDetailsPayload = {
  __typename?: 'UploadDetailsPayload';
  audioFilename: Scalars['String']['output'];
  audioUploadUrl: Scalars['String']['output'];
  imageFilename: Scalars['String']['output'];
  imageUploadUrl: Scalars['String']['output'];
};

export type UploadDetailsResponse = Error | UploadDetailsPayload;

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  CreateVideoResponse: ( CreateVideoPayload ) | ( Error );
  CreatingVideoResponse: ( CreatingVideoPayload ) | ( Error );
  NormaliseAudioResponse: ( Error ) | ( NormaliseAudioPayload );
  UploadDetailsResponse: ( Error ) | ( UploadDetailsPayload );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateVideoInput: CreateVideoInput;
  CreateVideoPayload: ResolverTypeWrapper<CreateVideoPayload>;
  CreateVideoResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateVideoResponse']>;
  CreatingVideoPayload: ResolverTypeWrapper<CreatingVideoPayload>;
  CreatingVideoResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreatingVideoResponse']>;
  Error: ResolverTypeWrapper<Error>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  NormaliseAudioInput: NormaliseAudioInput;
  NormaliseAudioPayload: ResolverTypeWrapper<NormaliseAudioPayload>;
  NormaliseAudioResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['NormaliseAudioResponse']>;
  NormaliseAudioSettings: NormaliseAudioSettings;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  UploadDetailsInput: UploadDetailsInput;
  UploadDetailsPayload: ResolverTypeWrapper<UploadDetailsPayload>;
  UploadDetailsResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UploadDetailsResponse']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  CreateVideoInput: CreateVideoInput;
  CreateVideoPayload: CreateVideoPayload;
  CreateVideoResponse: ResolversUnionTypes<ResolversParentTypes>['CreateVideoResponse'];
  CreatingVideoPayload: CreatingVideoPayload;
  CreatingVideoResponse: ResolversUnionTypes<ResolversParentTypes>['CreatingVideoResponse'];
  Error: Error;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Mutation: {};
  NormaliseAudioInput: NormaliseAudioInput;
  NormaliseAudioPayload: NormaliseAudioPayload;
  NormaliseAudioResponse: ResolversUnionTypes<ResolversParentTypes>['NormaliseAudioResponse'];
  NormaliseAudioSettings: NormaliseAudioSettings;
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
  UploadDetailsInput: UploadDetailsInput;
  UploadDetailsPayload: UploadDetailsPayload;
  UploadDetailsResponse: ResolversUnionTypes<ResolversParentTypes>['UploadDetailsResponse'];
}>;

export type CreateVideoPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateVideoPayload'] = ResolversParentTypes['CreateVideoPayload']> = ResolversObject<{
  trackingId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateVideoResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateVideoResponse'] = ResolversParentTypes['CreateVideoResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateVideoPayload' | 'Error', ParentType, ContextType>;
}>;

export type CreatingVideoPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatingVideoPayload'] = ResolversParentTypes['CreatingVideoPayload']> = ResolversObject<{
  outputFilename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  percentageComplete?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreatingVideoResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatingVideoResponse'] = ResolversParentTypes['CreatingVideoResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreatingVideoPayload' | 'Error', ParentType, ContextType>;
}>;

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createVideo?: Resolver<ResolversTypes['CreateVideoResponse'], ParentType, ContextType, RequireFields<MutationCreateVideoArgs, 'input'>>;
  normaliseAudio?: Resolver<ResolversTypes['NormaliseAudioResponse'], ParentType, ContextType, RequireFields<MutationNormaliseAudioArgs, 'input'>>;
}>;

export type NormaliseAudioPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['NormaliseAudioPayload'] = ResolversParentTypes['NormaliseAudioPayload']> = ResolversObject<{
  outputFilename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NormaliseAudioResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['NormaliseAudioResponse'] = ResolversParentTypes['NormaliseAudioResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Error' | 'NormaliseAudioPayload', ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uploadDetails?: Resolver<ResolversTypes['UploadDetailsResponse'], ParentType, ContextType, RequireFields<QueryUploadDetailsArgs, 'input'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  creatingVideo?: SubscriptionResolver<ResolversTypes['CreatingVideoResponse'], "creatingVideo", ParentType, ContextType, RequireFields<SubscriptionCreatingVideoArgs, 'trackingId'>>;
}>;

export type UploadDetailsPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadDetailsPayload'] = ResolversParentTypes['UploadDetailsPayload']> = ResolversObject<{
  audioFilename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  audioUploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageFilename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  imageUploadUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UploadDetailsResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadDetailsResponse'] = ResolversParentTypes['UploadDetailsResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Error' | 'UploadDetailsPayload', ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CreateVideoPayload?: CreateVideoPayloadResolvers<ContextType>;
  CreateVideoResponse?: CreateVideoResponseResolvers<ContextType>;
  CreatingVideoPayload?: CreatingVideoPayloadResolvers<ContextType>;
  CreatingVideoResponse?: CreatingVideoResponseResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NormaliseAudioPayload?: NormaliseAudioPayloadResolvers<ContextType>;
  NormaliseAudioResponse?: NormaliseAudioResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  UploadDetailsPayload?: UploadDetailsPayloadResolvers<ContextType>;
  UploadDetailsResponse?: UploadDetailsResponseResolvers<ContextType>;
}>;

