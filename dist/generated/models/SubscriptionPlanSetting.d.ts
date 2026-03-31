import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model SubscriptionPlanSetting
 *
 */
export type SubscriptionPlanSettingModel = runtime.Types.Result.DefaultSelection<Prisma.$SubscriptionPlanSettingPayload>;
export type AggregateSubscriptionPlanSetting = {
    _count: SubscriptionPlanSettingCountAggregateOutputType | null;
    _avg: SubscriptionPlanSettingAvgAggregateOutputType | null;
    _sum: SubscriptionPlanSettingSumAggregateOutputType | null;
    _min: SubscriptionPlanSettingMinAggregateOutputType | null;
    _max: SubscriptionPlanSettingMaxAggregateOutputType | null;
};
export type SubscriptionPlanSettingAvgAggregateOutputType = {
    price: number | null;
    durationDays: number | null;
};
export type SubscriptionPlanSettingSumAggregateOutputType = {
    price: number | null;
    durationDays: number | null;
};
export type SubscriptionPlanSettingMinAggregateOutputType = {
    id: string | null;
    plan: $Enums.SubscriptionPlan | null;
    label: string | null;
    price: number | null;
    durationDays: number | null;
    currency: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubscriptionPlanSettingMaxAggregateOutputType = {
    id: string | null;
    plan: $Enums.SubscriptionPlan | null;
    label: string | null;
    price: number | null;
    durationDays: number | null;
    currency: string | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SubscriptionPlanSettingCountAggregateOutputType = {
    id: number;
    plan: number;
    label: number;
    price: number;
    durationDays: number;
    currency: number;
    features: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SubscriptionPlanSettingAvgAggregateInputType = {
    price?: true;
    durationDays?: true;
};
export type SubscriptionPlanSettingSumAggregateInputType = {
    price?: true;
    durationDays?: true;
};
export type SubscriptionPlanSettingMinAggregateInputType = {
    id?: true;
    plan?: true;
    label?: true;
    price?: true;
    durationDays?: true;
    currency?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubscriptionPlanSettingMaxAggregateInputType = {
    id?: true;
    plan?: true;
    label?: true;
    price?: true;
    durationDays?: true;
    currency?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SubscriptionPlanSettingCountAggregateInputType = {
    id?: true;
    plan?: true;
    label?: true;
    price?: true;
    durationDays?: true;
    currency?: true;
    features?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SubscriptionPlanSettingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlanSetting to aggregate.
     */
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SubscriptionPlanSettings to fetch.
     */
    orderBy?: Prisma.SubscriptionPlanSettingOrderByWithRelationInput | Prisma.SubscriptionPlanSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.SubscriptionPlanSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SubscriptionPlanSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SubscriptionPlanSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SubscriptionPlanSettings
    **/
    _count?: true | SubscriptionPlanSettingCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: SubscriptionPlanSettingAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: SubscriptionPlanSettingSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionPlanSettingMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionPlanSettingMaxAggregateInputType;
};
export type GetSubscriptionPlanSettingAggregateType<T extends SubscriptionPlanSettingAggregateArgs> = {
    [P in keyof T & keyof AggregateSubscriptionPlanSetting]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSubscriptionPlanSetting[P]> : Prisma.GetScalarType<T[P], AggregateSubscriptionPlanSetting[P]>;
};
export type SubscriptionPlanSettingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    orderBy?: Prisma.SubscriptionPlanSettingOrderByWithAggregationInput | Prisma.SubscriptionPlanSettingOrderByWithAggregationInput[];
    by: Prisma.SubscriptionPlanSettingScalarFieldEnum[] | Prisma.SubscriptionPlanSettingScalarFieldEnum;
    having?: Prisma.SubscriptionPlanSettingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SubscriptionPlanSettingCountAggregateInputType | true;
    _avg?: SubscriptionPlanSettingAvgAggregateInputType;
    _sum?: SubscriptionPlanSettingSumAggregateInputType;
    _min?: SubscriptionPlanSettingMinAggregateInputType;
    _max?: SubscriptionPlanSettingMaxAggregateInputType;
};
export type SubscriptionPlanSettingGroupByOutputType = {
    id: string;
    plan: $Enums.SubscriptionPlan;
    label: string;
    price: number;
    durationDays: number;
    currency: string;
    features: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: SubscriptionPlanSettingCountAggregateOutputType | null;
    _avg: SubscriptionPlanSettingAvgAggregateOutputType | null;
    _sum: SubscriptionPlanSettingSumAggregateOutputType | null;
    _min: SubscriptionPlanSettingMinAggregateOutputType | null;
    _max: SubscriptionPlanSettingMaxAggregateOutputType | null;
};
export type GetSubscriptionPlanSettingGroupByPayload<T extends SubscriptionPlanSettingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SubscriptionPlanSettingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SubscriptionPlanSettingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SubscriptionPlanSettingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SubscriptionPlanSettingGroupByOutputType[P]>;
}>>;
export type SubscriptionPlanSettingWhereInput = {
    AND?: Prisma.SubscriptionPlanSettingWhereInput | Prisma.SubscriptionPlanSettingWhereInput[];
    OR?: Prisma.SubscriptionPlanSettingWhereInput[];
    NOT?: Prisma.SubscriptionPlanSettingWhereInput | Prisma.SubscriptionPlanSettingWhereInput[];
    id?: Prisma.StringFilter<"SubscriptionPlanSetting"> | string;
    plan?: Prisma.EnumSubscriptionPlanFilter<"SubscriptionPlanSetting"> | $Enums.SubscriptionPlan;
    label?: Prisma.StringFilter<"SubscriptionPlanSetting"> | string;
    price?: Prisma.FloatFilter<"SubscriptionPlanSetting"> | number;
    durationDays?: Prisma.IntFilter<"SubscriptionPlanSetting"> | number;
    currency?: Prisma.StringFilter<"SubscriptionPlanSetting"> | string;
    features?: Prisma.StringNullableListFilter<"SubscriptionPlanSetting">;
    isActive?: Prisma.BoolFilter<"SubscriptionPlanSetting"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"SubscriptionPlanSetting"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SubscriptionPlanSetting"> | Date | string;
};
export type SubscriptionPlanSettingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    features?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionPlanSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    plan?: $Enums.SubscriptionPlan;
    AND?: Prisma.SubscriptionPlanSettingWhereInput | Prisma.SubscriptionPlanSettingWhereInput[];
    OR?: Prisma.SubscriptionPlanSettingWhereInput[];
    NOT?: Prisma.SubscriptionPlanSettingWhereInput | Prisma.SubscriptionPlanSettingWhereInput[];
    label?: Prisma.StringFilter<"SubscriptionPlanSetting"> | string;
    price?: Prisma.FloatFilter<"SubscriptionPlanSetting"> | number;
    durationDays?: Prisma.IntFilter<"SubscriptionPlanSetting"> | number;
    currency?: Prisma.StringFilter<"SubscriptionPlanSetting"> | string;
    features?: Prisma.StringNullableListFilter<"SubscriptionPlanSetting">;
    isActive?: Prisma.BoolFilter<"SubscriptionPlanSetting"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"SubscriptionPlanSetting"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SubscriptionPlanSetting"> | Date | string;
}, "id" | "plan">;
export type SubscriptionPlanSettingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    features?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SubscriptionPlanSettingCountOrderByAggregateInput;
    _avg?: Prisma.SubscriptionPlanSettingAvgOrderByAggregateInput;
    _max?: Prisma.SubscriptionPlanSettingMaxOrderByAggregateInput;
    _min?: Prisma.SubscriptionPlanSettingMinOrderByAggregateInput;
    _sum?: Prisma.SubscriptionPlanSettingSumOrderByAggregateInput;
};
export type SubscriptionPlanSettingScalarWhereWithAggregatesInput = {
    AND?: Prisma.SubscriptionPlanSettingScalarWhereWithAggregatesInput | Prisma.SubscriptionPlanSettingScalarWhereWithAggregatesInput[];
    OR?: Prisma.SubscriptionPlanSettingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SubscriptionPlanSettingScalarWhereWithAggregatesInput | Prisma.SubscriptionPlanSettingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SubscriptionPlanSetting"> | string;
    plan?: Prisma.EnumSubscriptionPlanWithAggregatesFilter<"SubscriptionPlanSetting"> | $Enums.SubscriptionPlan;
    label?: Prisma.StringWithAggregatesFilter<"SubscriptionPlanSetting"> | string;
    price?: Prisma.FloatWithAggregatesFilter<"SubscriptionPlanSetting"> | number;
    durationDays?: Prisma.IntWithAggregatesFilter<"SubscriptionPlanSetting"> | number;
    currency?: Prisma.StringWithAggregatesFilter<"SubscriptionPlanSetting"> | string;
    features?: Prisma.StringNullableListFilter<"SubscriptionPlanSetting">;
    isActive?: Prisma.BoolWithAggregatesFilter<"SubscriptionPlanSetting"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SubscriptionPlanSetting"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"SubscriptionPlanSetting"> | Date | string;
};
export type SubscriptionPlanSettingCreateInput = {
    id?: string;
    plan: $Enums.SubscriptionPlan;
    label: string;
    price: number;
    durationDays?: number;
    currency?: string;
    features?: Prisma.SubscriptionPlanSettingCreatefeaturesInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionPlanSettingUncheckedCreateInput = {
    id?: string;
    plan: $Enums.SubscriptionPlan;
    label: string;
    price: number;
    durationDays?: number;
    currency?: string;
    features?: Prisma.SubscriptionPlanSettingCreatefeaturesInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionPlanSettingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    features?: Prisma.SubscriptionPlanSettingUpdatefeaturesInput | string[];
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionPlanSettingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    features?: Prisma.SubscriptionPlanSettingUpdatefeaturesInput | string[];
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionPlanSettingCreateManyInput = {
    id?: string;
    plan: $Enums.SubscriptionPlan;
    label: string;
    price: number;
    durationDays?: number;
    currency?: string;
    features?: Prisma.SubscriptionPlanSettingCreatefeaturesInput | string[];
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SubscriptionPlanSettingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    features?: Prisma.SubscriptionPlanSettingUpdatefeaturesInput | string[];
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionPlanSettingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    label?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.FloatFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    features?: Prisma.SubscriptionPlanSettingUpdatefeaturesInput | string[];
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SubscriptionPlanSettingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    features?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionPlanSettingAvgOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
};
export type SubscriptionPlanSettingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionPlanSettingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    label?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SubscriptionPlanSettingSumOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
};
export type SubscriptionPlanSettingCreatefeaturesInput = {
    set: string[];
};
export type SubscriptionPlanSettingUpdatefeaturesInput = {
    set?: string[];
    push?: string | string[];
};
export type SubscriptionPlanSettingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    plan?: boolean;
    label?: boolean;
    price?: boolean;
    durationDays?: boolean;
    currency?: boolean;
    features?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["subscriptionPlanSetting"]>;
export type SubscriptionPlanSettingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    plan?: boolean;
    label?: boolean;
    price?: boolean;
    durationDays?: boolean;
    currency?: boolean;
    features?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["subscriptionPlanSetting"]>;
export type SubscriptionPlanSettingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    plan?: boolean;
    label?: boolean;
    price?: boolean;
    durationDays?: boolean;
    currency?: boolean;
    features?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["subscriptionPlanSetting"]>;
export type SubscriptionPlanSettingSelectScalar = {
    id?: boolean;
    plan?: boolean;
    label?: boolean;
    price?: boolean;
    durationDays?: boolean;
    currency?: boolean;
    features?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SubscriptionPlanSettingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "plan" | "label" | "price" | "durationDays" | "currency" | "features" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["subscriptionPlanSetting"]>;
export type $SubscriptionPlanSettingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SubscriptionPlanSetting";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        plan: $Enums.SubscriptionPlan;
        label: string;
        price: number;
        durationDays: number;
        currency: string;
        features: string[];
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["subscriptionPlanSetting"]>;
    composites: {};
};
export type SubscriptionPlanSettingGetPayload<S extends boolean | null | undefined | SubscriptionPlanSettingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload, S>;
export type SubscriptionPlanSettingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SubscriptionPlanSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SubscriptionPlanSettingCountAggregateInputType | true;
};
export interface SubscriptionPlanSettingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SubscriptionPlanSetting'];
        meta: {
            name: 'SubscriptionPlanSetting';
        };
    };
    /**
     * Find zero or one SubscriptionPlanSetting that matches the filter.
     * @param {SubscriptionPlanSettingFindUniqueArgs} args - Arguments to find a SubscriptionPlanSetting
     * @example
     * // Get one SubscriptionPlanSetting
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionPlanSettingFindUniqueArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one SubscriptionPlanSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionPlanSettingFindUniqueOrThrowArgs} args - Arguments to find a SubscriptionPlanSetting
     * @example
     * // Get one SubscriptionPlanSetting
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionPlanSettingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SubscriptionPlanSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanSettingFindFirstArgs} args - Arguments to find a SubscriptionPlanSetting
     * @example
     * // Get one SubscriptionPlanSetting
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionPlanSettingFindFirstArgs>(args?: Prisma.SelectSubset<T, SubscriptionPlanSettingFindFirstArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first SubscriptionPlanSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanSettingFindFirstOrThrowArgs} args - Arguments to find a SubscriptionPlanSetting
     * @example
     * // Get one SubscriptionPlanSetting
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionPlanSettingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SubscriptionPlanSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more SubscriptionPlanSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubscriptionPlanSettings
     * const subscriptionPlanSettings = await prisma.subscriptionPlanSetting.findMany()
     *
     * // Get first 10 SubscriptionPlanSettings
     * const subscriptionPlanSettings = await prisma.subscriptionPlanSetting.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const subscriptionPlanSettingWithIdOnly = await prisma.subscriptionPlanSetting.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SubscriptionPlanSettingFindManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionPlanSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a SubscriptionPlanSetting.
     * @param {SubscriptionPlanSettingCreateArgs} args - Arguments to create a SubscriptionPlanSetting.
     * @example
     * // Create one SubscriptionPlanSetting
     * const SubscriptionPlanSetting = await prisma.subscriptionPlanSetting.create({
     *   data: {
     *     // ... data to create a SubscriptionPlanSetting
     *   }
     * })
     *
     */
    create<T extends SubscriptionPlanSettingCreateArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingCreateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many SubscriptionPlanSettings.
     * @param {SubscriptionPlanSettingCreateManyArgs} args - Arguments to create many SubscriptionPlanSettings.
     * @example
     * // Create many SubscriptionPlanSettings
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SubscriptionPlanSettingCreateManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionPlanSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many SubscriptionPlanSettings and returns the data saved in the database.
     * @param {SubscriptionPlanSettingCreateManyAndReturnArgs} args - Arguments to create many SubscriptionPlanSettings.
     * @example
     * // Create many SubscriptionPlanSettings
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many SubscriptionPlanSettings and only return the `id`
     * const subscriptionPlanSettingWithIdOnly = await prisma.subscriptionPlanSetting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SubscriptionPlanSettingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SubscriptionPlanSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a SubscriptionPlanSetting.
     * @param {SubscriptionPlanSettingDeleteArgs} args - Arguments to delete one SubscriptionPlanSetting.
     * @example
     * // Delete one SubscriptionPlanSetting
     * const SubscriptionPlanSetting = await prisma.subscriptionPlanSetting.delete({
     *   where: {
     *     // ... filter to delete one SubscriptionPlanSetting
     *   }
     * })
     *
     */
    delete<T extends SubscriptionPlanSettingDeleteArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingDeleteArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one SubscriptionPlanSetting.
     * @param {SubscriptionPlanSettingUpdateArgs} args - Arguments to update one SubscriptionPlanSetting.
     * @example
     * // Update one SubscriptionPlanSetting
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SubscriptionPlanSettingUpdateArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingUpdateArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more SubscriptionPlanSettings.
     * @param {SubscriptionPlanSettingDeleteManyArgs} args - Arguments to filter SubscriptionPlanSettings to delete.
     * @example
     * // Delete a few SubscriptionPlanSettings
     * const { count } = await prisma.subscriptionPlanSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SubscriptionPlanSettingDeleteManyArgs>(args?: Prisma.SelectSubset<T, SubscriptionPlanSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SubscriptionPlanSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubscriptionPlanSettings
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SubscriptionPlanSettingUpdateManyArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more SubscriptionPlanSettings and returns the data updated in the database.
     * @param {SubscriptionPlanSettingUpdateManyAndReturnArgs} args - Arguments to update many SubscriptionPlanSettings.
     * @example
     * // Update many SubscriptionPlanSettings
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more SubscriptionPlanSettings and only return the `id`
     * const subscriptionPlanSettingWithIdOnly = await prisma.subscriptionPlanSetting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SubscriptionPlanSettingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one SubscriptionPlanSetting.
     * @param {SubscriptionPlanSettingUpsertArgs} args - Arguments to update or create a SubscriptionPlanSetting.
     * @example
     * // Update or create a SubscriptionPlanSetting
     * const subscriptionPlanSetting = await prisma.subscriptionPlanSetting.upsert({
     *   create: {
     *     // ... data to create a SubscriptionPlanSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubscriptionPlanSetting we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionPlanSettingUpsertArgs>(args: Prisma.SelectSubset<T, SubscriptionPlanSettingUpsertArgs<ExtArgs>>): Prisma.Prisma__SubscriptionPlanSettingClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPlanSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of SubscriptionPlanSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanSettingCountArgs} args - Arguments to filter SubscriptionPlanSettings to count.
     * @example
     * // Count the number of SubscriptionPlanSettings
     * const count = await prisma.subscriptionPlanSetting.count({
     *   where: {
     *     // ... the filter for the SubscriptionPlanSettings we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionPlanSettingCountArgs>(args?: Prisma.Subset<T, SubscriptionPlanSettingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SubscriptionPlanSettingCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a SubscriptionPlanSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionPlanSettingAggregateArgs>(args: Prisma.Subset<T, SubscriptionPlanSettingAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionPlanSettingAggregateType<T>>;
    /**
     * Group by SubscriptionPlanSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionPlanSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends SubscriptionPlanSettingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SubscriptionPlanSettingGroupByArgs['orderBy'];
    } : {
        orderBy?: SubscriptionPlanSettingGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SubscriptionPlanSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionPlanSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the SubscriptionPlanSetting model
     */
    readonly fields: SubscriptionPlanSettingFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for SubscriptionPlanSetting.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__SubscriptionPlanSettingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the SubscriptionPlanSetting model
 */
export interface SubscriptionPlanSettingFieldRefs {
    readonly id: Prisma.FieldRef<"SubscriptionPlanSetting", 'String'>;
    readonly plan: Prisma.FieldRef<"SubscriptionPlanSetting", 'SubscriptionPlan'>;
    readonly label: Prisma.FieldRef<"SubscriptionPlanSetting", 'String'>;
    readonly price: Prisma.FieldRef<"SubscriptionPlanSetting", 'Float'>;
    readonly durationDays: Prisma.FieldRef<"SubscriptionPlanSetting", 'Int'>;
    readonly currency: Prisma.FieldRef<"SubscriptionPlanSetting", 'String'>;
    readonly features: Prisma.FieldRef<"SubscriptionPlanSetting", 'String[]'>;
    readonly isActive: Prisma.FieldRef<"SubscriptionPlanSetting", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"SubscriptionPlanSetting", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"SubscriptionPlanSetting", 'DateTime'>;
}
/**
 * SubscriptionPlanSetting findUnique
 */
export type SubscriptionPlanSettingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlanSetting to fetch.
     */
    where: Prisma.SubscriptionPlanSettingWhereUniqueInput;
};
/**
 * SubscriptionPlanSetting findUniqueOrThrow
 */
export type SubscriptionPlanSettingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlanSetting to fetch.
     */
    where: Prisma.SubscriptionPlanSettingWhereUniqueInput;
};
/**
 * SubscriptionPlanSetting findFirst
 */
export type SubscriptionPlanSettingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlanSetting to fetch.
     */
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SubscriptionPlanSettings to fetch.
     */
    orderBy?: Prisma.SubscriptionPlanSettingOrderByWithRelationInput | Prisma.SubscriptionPlanSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SubscriptionPlanSettings.
     */
    cursor?: Prisma.SubscriptionPlanSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SubscriptionPlanSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SubscriptionPlanSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SubscriptionPlanSettings.
     */
    distinct?: Prisma.SubscriptionPlanSettingScalarFieldEnum | Prisma.SubscriptionPlanSettingScalarFieldEnum[];
};
/**
 * SubscriptionPlanSetting findFirstOrThrow
 */
export type SubscriptionPlanSettingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlanSetting to fetch.
     */
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SubscriptionPlanSettings to fetch.
     */
    orderBy?: Prisma.SubscriptionPlanSettingOrderByWithRelationInput | Prisma.SubscriptionPlanSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SubscriptionPlanSettings.
     */
    cursor?: Prisma.SubscriptionPlanSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SubscriptionPlanSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SubscriptionPlanSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SubscriptionPlanSettings.
     */
    distinct?: Prisma.SubscriptionPlanSettingScalarFieldEnum | Prisma.SubscriptionPlanSettingScalarFieldEnum[];
};
/**
 * SubscriptionPlanSetting findMany
 */
export type SubscriptionPlanSettingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * Filter, which SubscriptionPlanSettings to fetch.
     */
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SubscriptionPlanSettings to fetch.
     */
    orderBy?: Prisma.SubscriptionPlanSettingOrderByWithRelationInput | Prisma.SubscriptionPlanSettingOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SubscriptionPlanSettings.
     */
    cursor?: Prisma.SubscriptionPlanSettingWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SubscriptionPlanSettings from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SubscriptionPlanSettings.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SubscriptionPlanSettings.
     */
    distinct?: Prisma.SubscriptionPlanSettingScalarFieldEnum | Prisma.SubscriptionPlanSettingScalarFieldEnum[];
};
/**
 * SubscriptionPlanSetting create
 */
export type SubscriptionPlanSettingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * The data needed to create a SubscriptionPlanSetting.
     */
    data: Prisma.XOR<Prisma.SubscriptionPlanSettingCreateInput, Prisma.SubscriptionPlanSettingUncheckedCreateInput>;
};
/**
 * SubscriptionPlanSetting createMany
 */
export type SubscriptionPlanSettingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubscriptionPlanSettings.
     */
    data: Prisma.SubscriptionPlanSettingCreateManyInput | Prisma.SubscriptionPlanSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * SubscriptionPlanSetting createManyAndReturn
 */
export type SubscriptionPlanSettingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * The data used to create many SubscriptionPlanSettings.
     */
    data: Prisma.SubscriptionPlanSettingCreateManyInput | Prisma.SubscriptionPlanSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * SubscriptionPlanSetting update
 */
export type SubscriptionPlanSettingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * The data needed to update a SubscriptionPlanSetting.
     */
    data: Prisma.XOR<Prisma.SubscriptionPlanSettingUpdateInput, Prisma.SubscriptionPlanSettingUncheckedUpdateInput>;
    /**
     * Choose, which SubscriptionPlanSetting to update.
     */
    where: Prisma.SubscriptionPlanSettingWhereUniqueInput;
};
/**
 * SubscriptionPlanSetting updateMany
 */
export type SubscriptionPlanSettingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update SubscriptionPlanSettings.
     */
    data: Prisma.XOR<Prisma.SubscriptionPlanSettingUpdateManyMutationInput, Prisma.SubscriptionPlanSettingUncheckedUpdateManyInput>;
    /**
     * Filter which SubscriptionPlanSettings to update
     */
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    /**
     * Limit how many SubscriptionPlanSettings to update.
     */
    limit?: number;
};
/**
 * SubscriptionPlanSetting updateManyAndReturn
 */
export type SubscriptionPlanSettingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * The data used to update SubscriptionPlanSettings.
     */
    data: Prisma.XOR<Prisma.SubscriptionPlanSettingUpdateManyMutationInput, Prisma.SubscriptionPlanSettingUncheckedUpdateManyInput>;
    /**
     * Filter which SubscriptionPlanSettings to update
     */
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    /**
     * Limit how many SubscriptionPlanSettings to update.
     */
    limit?: number;
};
/**
 * SubscriptionPlanSetting upsert
 */
export type SubscriptionPlanSettingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * The filter to search for the SubscriptionPlanSetting to update in case it exists.
     */
    where: Prisma.SubscriptionPlanSettingWhereUniqueInput;
    /**
     * In case the SubscriptionPlanSetting found by the `where` argument doesn't exist, create a new SubscriptionPlanSetting with this data.
     */
    create: Prisma.XOR<Prisma.SubscriptionPlanSettingCreateInput, Prisma.SubscriptionPlanSettingUncheckedCreateInput>;
    /**
     * In case the SubscriptionPlanSetting was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.SubscriptionPlanSettingUpdateInput, Prisma.SubscriptionPlanSettingUncheckedUpdateInput>;
};
/**
 * SubscriptionPlanSetting delete
 */
export type SubscriptionPlanSettingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
    /**
     * Filter which SubscriptionPlanSetting to delete.
     */
    where: Prisma.SubscriptionPlanSettingWhereUniqueInput;
};
/**
 * SubscriptionPlanSetting deleteMany
 */
export type SubscriptionPlanSettingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which SubscriptionPlanSettings to delete
     */
    where?: Prisma.SubscriptionPlanSettingWhereInput;
    /**
     * Limit how many SubscriptionPlanSettings to delete.
     */
    limit?: number;
};
/**
 * SubscriptionPlanSetting without action
 */
export type SubscriptionPlanSettingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionPlanSetting
     */
    select?: Prisma.SubscriptionPlanSettingSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the SubscriptionPlanSetting
     */
    omit?: Prisma.SubscriptionPlanSettingOmit<ExtArgs> | null;
};
//# sourceMappingURL=SubscriptionPlanSetting.d.ts.map