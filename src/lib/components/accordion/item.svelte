<script lang="ts">
    import IconCaretDown from '@tabler/icons-svelte/icons/caret-down';
    import { Accordion as BitsAccordion } from 'bits-ui';
    import type { Snippet } from 'svelte';

    type Props = BitsAccordion.ItemProps & {
        title: string;
        children: Snippet;
        itemClass?: string;
        summaryClass?: string;
        contentClass?: string;
    };

    let {
        title,
        children,
        value,
        disabled,
        itemClass,
        summaryClass,
        contentClass,
        ...restProps
    }: Props = $props();
</script>

<BitsAccordion.Item
    {value}
    {disabled}
    class={[
        'group rounded-2xl border border-slate-200 bg-slate-50',
        'transition-shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500/70 has-[:focus-visible]:ring-offset-2',
        itemClass
    ]}
    {...restProps}
>
    <BitsAccordion.Header>
        <BitsAccordion.Trigger
            class={[
                'flex w-full cursor-pointer items-center justify-between p-4 text-left text-sm font-semibold text-slate-700 sm:p-5',
                'rounded-2xl outline-none',
                summaryClass
            ]}
        >
            <span>{title}</span>
            <span
                class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
            >
                <IconCaretDown
                    class="size-[18px] transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
            </span>
        </BitsAccordion.Trigger>
    </BitsAccordion.Header>
    <BitsAccordion.Content
        class={[
            'overflow-hidden text-sm leading-relaxed text-slate-600',
            'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
            contentClass
        ]}
    >
        <div class="px-4 pb-4 sm:px-5 sm:pb-5">
            {@render children()}
        </div>
    </BitsAccordion.Content>
</BitsAccordion.Item>
