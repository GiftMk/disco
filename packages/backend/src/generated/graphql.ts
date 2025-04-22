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

export type AudioInput = {
  assetId: Scalars['ID']['input'];
  settings?: InputMaybe<AudioSettings>;
};

export type AudioSettings = {
  integrated: Scalars['Float']['input'];
  loudnessRange: Scalars['Float']['input'];
  truePeak: Scalars['Float']['input'];
};

export type CreateVideoPayload = {
  __typename?: 'CreateVideoPayload';
  trackingId: Scalars['ID']['output'];
};

export type CreateVideoResponse = CreateVideoPayload | Error;

export type CreatingVideoPayload = {
  __typename?: 'CreatingVideoPayload';
  percentageComplete?: Maybe<Scalars['Float']['output']>;
  videoFilename?: Maybe<Scalars['String']['output']>;
};

export type CreatingVideoResponse = CreatingVideoPayload | Error;

export type Error = {
  __typename?: 'Error';
  message: Scalars['String']['output'];
};

export type ImageInput = {
  assetId: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createVideo: CreateVideoResponse;
};


export type MutationCreateVideoArgs = {
  audio: AudioInput;
  image: ImageInput;
};

export type PresignedUrlPayload = {
  __typename?: 'PresignedUrlPayload';
  assetId: Scalars['ID']['output'];
  url: Scalars['String']['output'];
};

export type PresignedUrlResponse = Error | PresignedUrlPayload;

export type Query = {
  __typename?: 'Query';
  presignedUrl: PresignedUrlResponse;
};


export type QueryPresignedUrlArgs = {
  fileExtension: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  creatingVideo: CreatingVideoResponse;
};


export type SubscriptionCreatingVideoArgs = {
  trackingId: Scalars['ID']['input'];
};

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
  PresignedUrlResponse: ( Error ) | ( PresignedUrlPayload );
}>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AudioInput: AudioInput;
  AudioSettings: AudioSettings;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateVideoPayload: ResolverTypeWrapper<CreateVideoPayload>;
  CreateVideoResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateVideoResponse']>;
  CreatingVideoPayload: ResolverTypeWrapper<CreatingVideoPayload>;
  CreatingVideoResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreatingVideoResponse']>;
  Error: ResolverTypeWrapper<Error>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ImageInput: ImageInput;
  Mutation: ResolverTypeWrapper<{}>;
  PresignedUrlPayload: ResolverTypeWrapper<PresignedUrlPayload>;
  PresignedUrlResponse: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['PresignedUrlResponse']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AudioInput: AudioInput;
  AudioSettings: AudioSettings;
  Boolean: Scalars['Boolean']['output'];
  CreateVideoPayload: CreateVideoPayload;
  CreateVideoResponse: ResolversUnionTypes<ResolversParentTypes>['CreateVideoResponse'];
  CreatingVideoPayload: CreatingVideoPayload;
  CreatingVideoResponse: ResolversUnionTypes<ResolversParentTypes>['CreatingVideoResponse'];
  Error: Error;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  ImageInput: ImageInput;
  Mutation: {};
  PresignedUrlPayload: PresignedUrlPayload;
  PresignedUrlResponse: ResolversUnionTypes<ResolversParentTypes>['PresignedUrlResponse'];
  Query: {};
  String: Scalars['String']['output'];
  Subscription: {};
}>;

export type CreateVideoPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateVideoPayload'] = ResolversParentTypes['CreateVideoPayload']> = ResolversObject<{
  trackingId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateVideoResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateVideoResponse'] = ResolversParentTypes['CreateVideoResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'CreateVideoPayload' | 'Error', ParentType, ContextType>;
}>;

export type CreatingVideoPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatingVideoPayload'] = ResolversParentTypes['CreatingVideoPayload']> = ResolversObject<{
  percentageComplete?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  videoFilename?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  createVideo?: Resolver<ResolversTypes['CreateVideoResponse'], ParentType, ContextType, RequireFields<MutationCreateVideoArgs, 'audio' | 'image'>>;
}>;

export type PresignedUrlPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['PresignedUrlPayload'] = ResolversParentTypes['PresignedUrlPayload']> = ResolversObject<{
  assetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PresignedUrlResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['PresignedUrlResponse'] = ResolversParentTypes['PresignedUrlResponse']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Error' | 'PresignedUrlPayload', ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  presignedUrl?: Resolver<ResolversTypes['PresignedUrlResponse'], ParentType, ContextType, RequireFields<QueryPresignedUrlArgs, 'fileExtension'>>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  creatingVideo?: SubscriptionResolver<ResolversTypes['CreatingVideoResponse'], "creatingVideo", ParentType, ContextType, RequireFields<SubscriptionCreatingVideoArgs, 'trackingId'>>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  CreateVideoPayload?: CreateVideoPayloadResolvers<ContextType>;
  CreateVideoResponse?: CreateVideoResponseResolvers<ContextType>;
  CreatingVideoPayload?: CreatingVideoPayloadResolvers<ContextType>;
  CreatingVideoResponse?: CreatingVideoResponseResolvers<ContextType>;
  Error?: ErrorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PresignedUrlPayload?: PresignedUrlPayloadResolvers<ContextType>;
  PresignedUrlResponse?: PresignedUrlResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;

