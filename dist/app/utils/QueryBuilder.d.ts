import { IQueryConfig, IQueryParams, IQueryResult, PrismaFindManyArgs, PrismaModelDelegate } from "../interfaces/query.interface.js";
export declare class QueryBuilder<T, TWhereInput = Record<string, unknown>, TInclude = Record<string, unknown>> {
    private model;
    private queryParams;
    private config;
    private query;
    private countQuery;
    private page;
    private limit;
    private skip;
    private sortBy;
    private sortOrder;
    private selectFields;
    constructor(model: PrismaModelDelegate, queryParams: IQueryParams, config?: IQueryConfig);
    search(): this;
    filter(): this;
    paginate(): this;
    sort(): this;
    fields(): this;
    include(relation: TInclude): this;
    dynamicInclude(includeConfig: Record<string, unknown>, defaultInclude?: string[]): this;
    where(condition: TWhereInput): this;
    execute(): Promise<IQueryResult<T>>;
    count(): Promise<number>;
    getQuery(): PrismaFindManyArgs;
    private deepMerge;
    private parseFilterValue;
    private parseRangeFilter;
}
//# sourceMappingURL=QueryBuilder.d.ts.map