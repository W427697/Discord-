<script setup lang="ts">
export interface MyNestedProps {
	/**
	 * nested prop documentation
	 */
	nestedProp: string;
}

interface MyIgnoredNestedProps {
	nestedProp: string;
}

interface MyNestedRecursiveProps {
	recursive: MyNestedRecursiveProps
}

enum MyEnum {
	Small,
	Medium,
	Large,
}

const categories = [
	'Uncategorized',
	'Content',
	'Interaction',
	'Display',
	'Forms',
	'Addons',
] as const;

type MyCategories = typeof categories[number];

interface MyProps {
	/**
	 * string foo
	 *
	 * @default "rounded"
	 * @since v1.0.0
	 * @see https://vuejs.org/
	 * @deprecated v1.1.0
	 */
	foo: string,
	/**
	 * optional number bar
	 */
	bar?: number,
	/**
	 * string array baz
	 */
	baz?: string[],
	/**
	 * required union type
	 */
	union: string | number,
	/**
	 * optional union type
	 */
	unionOptional?: string | number,
	/**
	 * required nested object
	 */
	nested: MyNestedProps,
	/**
	 * required nested object with intersection
	 */
	nestedIntersection: MyNestedProps & {
		/**
		 * required additional property
		 */
		additionalProp: string;
	},
	/**
	 * optional nested object
	 */
	nestedOptional?: MyNestedProps | MyIgnoredNestedProps,
	/**
	 * required array object
	 */
	array: MyNestedProps[],
	/**
	 * optional array object
	 */
	arrayOptional?: MyNestedProps[],
	/**
	 * enum value
	 */
	enumValue: MyEnum,
	/**
	 * literal type alias that require context
	 */
	literalFromContext: MyCategories,
	inlined: { foo: string; },
	recursive: MyNestedRecursiveProps
}


withDefaults(defineProps<MyProps>(), {
	bar: 1,
	baz: () => ['foo', 'bar'],
});
</script>
<template>
	<pre>{{ JSON.stringify($props, null, 2) }}</pre>
</template>
