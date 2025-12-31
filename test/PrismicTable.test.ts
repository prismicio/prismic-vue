import { describe, expect, it } from "vitest"

import { type TableField, createClient } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { defineComponent, markRaw } from "vue"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"

import {
	PrismicTable,
	createPrismic,
	getRichTextComponentProps,
	getTableComponentProps,
} from "../src"

const filledTableField: TableField = {
	head: {
		rows: [
			{
				key: "string",
				cells: [
					{
						key: "string",
						type: "header",
						content: [{ type: "paragraph", text: "Method", spans: [] }],
					},
					{
						key: "string",
						type: "header",
						content: [{ type: "paragraph", text: "Usage", spans: [] }],
					},
				],
			},
		],
	},
	body: {
		rows: [
			{
				key: "string",
				cells: [
					{
						key: "string",
						type: "header",
						content: [{ type: "paragraph", text: "GET", spans: [] }],
					},
					{
						key: "string",
						type: "data",
						content: [
							{
								type: "paragraph",
								text: "For basic retrieval of information…",
								spans: [
									{
										type: "strong",
										end: 19,
										start: 4,
									},
								],
							},
						],
					},
				],
			},
			{
				key: "string",
				cells: [
					{
						key: "string",
						type: "header",
						content: [{ type: "paragraph", text: "DELETE", spans: [] }],
					},
					{
						key: "string",
						type: "data",
						content: [
							{
								type: "paragraph",
								text: "To destroy a resource and remove…",
								spans: [
									{
										type: "em",
										end: 7,
										start: 3,
									},
								],
							},
						],
					},
				],
			},
		],
	},
}

describe("renders a table field", () => {
	it("as components", () => {
		const output = mount(PrismicTable, {
			props: {
				field: filledTableField,
			},
		})

		expect(output.html()).toBe(`<table>
  <thead>
    <tr>
      <th>
        <p>
          <!--v-if-->Method
        </p>
      </th>
      <th>
        <p>
          <!--v-if-->Usage
        </p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        <p>
          <!--v-if-->GET
        </p>
      </th>
      <td>
        <p>
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </td>
    </tr>
    <tr>
      <th>
        <p>
          <!--v-if-->DELETE
        </p>
      </th>
      <td>
        <p>
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </td>
    </tr>
  </tbody>
</table>`)
	})

	it("as nothing when passed an empty field", () => {
		const output = mount(PrismicTable, {
			props: {
				field: undefined,
			},
		})

		expect(output.html()).toBe("<!--v-if-->")
	})
})

it("renders fallback when passed an empty field", () => {
	const undefinedField = mount(PrismicTable, {
		props: { field: undefined, fallback: markRaw(WrapperComponent) },
	})

	expect(undefinedField.html()).toBe(`<div class="wrapperComponent"></div>`)
})

describe("uses table components", () => {
	it("from plugin", () => {
		const prismic = createPrismic({
			client: createClient("example"),
			components: {
				defaultComponents: {
					table: markRaw(
						defineComponent({
							template: /* html */ `<div class="table"><slot></slot></div>`,
							props: getTableComponentProps.table(),
						}),
					),
					thead: markRaw(
						defineComponent({
							template: /* html */ `<div class="thead"><slot></slot></div>`,
							props: getTableComponentProps.thead(),
						}),
					),
					tbody: markRaw(
						defineComponent({
							template: /* html */ `<div class="tbody"><slot></slot></div>`,
							props: getTableComponentProps.tbody(),
						}),
					),
					tr: markRaw(
						defineComponent({
							template: /* html */ `<div class="tr"><slot></slot></div>`,
							props: getTableComponentProps.tr(),
						}),
					),
					th: markRaw(
						defineComponent({
							template: /* html */ `<div class="th"><slot></slot></div>`,
							props: getTableComponentProps.th(),
						}),
					),
					td: markRaw(
						defineComponent({
							template: /* html */ `<div class="td"><slot></slot></div>`,
							props: getTableComponentProps.td(),
						}),
					),
					paragraph: markRaw(
						defineComponent({
							template: /* html */ `<p class="paragraph"><slot></slot></p>`,
							props: getRichTextComponentProps("paragraph"),
						}),
					),
				},
			},
		})

		const output = mount(PrismicTable, {
			props: {
				field: filledTableField,
			},
			global: {
				plugins: [prismic],
			},
		})

		expect(output.html()).toBe(`<div class="table">
  <div class="thead">
    <div class="tr">
      <div class="th">
        <p class="paragraph">
          <!--v-if-->Method
        </p>
      </div>
      <div class="th">
        <p class="paragraph">
          <!--v-if-->Usage
        </p>
      </div>
    </div>
  </div>
  <div class="tbody">
    <div class="tr">
      <div class="th">
        <p class="paragraph">
          <!--v-if-->GET
        </p>
      </div>
      <div class="td">
        <p class="paragraph">
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </div>
    </div>
    <div class="tr">
      <div class="th">
        <p class="paragraph">
          <!--v-if-->DELETE
        </p>
      </div>
      <div class="td">
        <p class="paragraph">
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </div>
    </div>
  </div>
</div>`)
	})

	it("from props", () => {
		const output = mount(PrismicTable, {
			props: {
				field: filledTableField,
				components: {
					table: markRaw(
						defineComponent({
							template: /* html */ `<div class="table"><slot></slot></div>`,
							props: getTableComponentProps.table(),
						}),
					),
					thead: markRaw(
						defineComponent({
							template: /* html */ `<div class="thead"><slot></slot></div>`,
							props: getTableComponentProps.thead(),
						}),
					),
					tbody: markRaw(
						defineComponent({
							template: /* html */ `<div class="tbody"><slot></slot></div>`,
							props: getTableComponentProps.tbody(),
						}),
					),
					tr: markRaw(
						defineComponent({
							template: /* html */ `<div class="tr"><slot></slot></div>`,
							props: getTableComponentProps.tr(),
						}),
					),
					th: markRaw(
						defineComponent({
							template: /* html */ `<div class="th"><slot></slot></div>`,
							props: getTableComponentProps.th(),
						}),
					),
					td: markRaw(
						defineComponent({
							template: /* html */ `<div class="td"><slot></slot></div>`,
							props: getTableComponentProps.td(),
						}),
					),
				},
			},
		})

		expect(output.html()).toBe(`<div class="table">
  <div class="thead">
    <div class="tr">
      <div class="th">
        <p>
          <!--v-if-->Method
        </p>
      </div>
      <div class="th">
        <p>
          <!--v-if-->Usage
        </p>
      </div>
    </div>
  </div>
  <div class="tbody">
    <div class="tr">
      <div class="th">
        <p>
          <!--v-if-->GET
        </p>
      </div>
      <div class="td">
        <p>
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </div>
    </div>
    <div class="tr">
      <div class="th">
        <p>
          <!--v-if-->DELETE
        </p>
      </div>
      <div class="td">
        <p>
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </div>
    </div>
  </div>
</div>`)
	})
})

describe("uses table shorthands", () => {
	it("from props", () => {
		const output = mount(PrismicTable, {
			props: {
				field: filledTableField,
				components: {
					table: { class: "table" },
					thead: { class: "thead" },
					tbody: { class: "tbody" },
					tr: { class: "tr" },
					th: { class: "th" },
					td: { class: "td" },
				},
			},
		})

		expect(output.html()).toBe(`<table class="table">
  <thead class="thead">
    <tr class="tr">
      <th class="th">
        <p>
          <!--v-if-->Method
        </p>
      </th>
      <th class="th">
        <p>
          <!--v-if-->Usage
        </p>
      </th>
    </tr>
  </thead>
  <tbody class="tbody">
    <tr class="tr">
      <th class="th">
        <p>
          <!--v-if-->GET
        </p>
      </th>
      <td class="td">
        <p>
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </td>
    </tr>
    <tr class="tr">
      <th class="th">
        <p>
          <!--v-if-->DELETE
        </p>
      </th>
      <td class="td">
        <p>
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </td>
    </tr>
  </tbody>
</table>`)
	})
})

describe("uses rich text components serializer", () => {
	it("from props", () => {
		const output = mount(PrismicTable, {
			props: {
				field: filledTableField,
				components: {
					table: markRaw(
						defineComponent({
							template: /* html */ `<table class="table"><slot></slot></table>`,
							props: getTableComponentProps.table(),
						}),
					),
					paragraph: markRaw(
						defineComponent({
							template: /* html */ `<p class="paragraph"><slot></slot></p>`,
							props: getRichTextComponentProps("paragraph"),
						}),
					),
				},
			},
		})

		expect(output.html()).toBe(`<table class="table">
  <thead>
    <tr>
      <th>
        <p class="paragraph">
          <!--v-if-->Method
        </p>
      </th>
      <th>
        <p class="paragraph">
          <!--v-if-->Usage
        </p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        <p class="paragraph">
          <!--v-if-->GET
        </p>
      </th>
      <td>
        <p class="paragraph">
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </td>
    </tr>
    <tr>
      <th>
        <p class="paragraph">
          <!--v-if-->DELETE
        </p>
      </th>
      <td>
        <p class="paragraph">
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </td>
    </tr>
  </tbody>
</table>`)
	})
})

describe("uses rich text shorthand serializer", () => {
	it("from props", () => {
		const output = mount(PrismicTable, {
			props: {
				field: filledTableField,
				components: {
					table: { class: "table" },
					paragraph: { as: "p", class: "paragraph" },
				},
			},
		})

		expect(output.html()).toBe(`<table class="table">
  <thead>
    <tr>
      <th>
        <p class="paragraph">
          <!--v-if-->Method
        </p>
      </th>
      <th>
        <p class="paragraph">
          <!--v-if-->Usage
        </p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        <p class="paragraph">
          <!--v-if-->GET
        </p>
      </th>
      <td>
        <p class="paragraph">
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </td>
    </tr>
    <tr>
      <th>
        <p class="paragraph">
          <!--v-if-->DELETE
        </p>
      </th>
      <td>
        <p class="paragraph">
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </td>
    </tr>
  </tbody>
</table>`)
	})
})
