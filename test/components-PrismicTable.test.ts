import { describe, expect, it } from "vitest"

import type { TableField } from "@prismicio/client"
import { mount } from "@vue/test-utils"
import { defineComponent, markRaw } from "vue"

import { WrapperComponent } from "./__fixtures__/WrapperComponent"

import { PrismicTable } from "../src"

const filledTableField: TableField = {
	head: {
		rows: [
			{
				cells: [
					{
						type: "header",
						content: [{ type: "paragraph", text: "Method", spans: [] }],
					},
					{
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
				cells: [
					{
						type: "header",
						content: [{ type: "paragraph", text: "GET", spans: [] }],
					},
					{
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
				cells: [
					{
						type: "header",
						content: [{ type: "paragraph", text: "DELETE", spans: [] }],
					},
					{
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

		expect(output.html()).toBe("")
	})
})

it("renders fallback when passed an empty field", () => {
	const undefinedField = mount(PrismicTable, {
		props: { field: undefined, fallback: markRaw(WrapperComponent) },
	})

	expect(undefinedField.html()).toBe(`<div class="wrapperComponent"></div>`)
})

it("renders custom table elements", () => {
	const output = mount(PrismicTable, {
		props: {
			field: filledTableField,
			components: {
				table: markRaw(
					defineComponent({
						template: `<div class="table"><slot></slot></div>`,
					}),
				),
				thead: markRaw(
					defineComponent({
						template: `<div class="thead"><slot></slot></div>`,
					}),
				),
				tbody: markRaw(
					defineComponent({
						template: `<div class="tbody"><slot></slot></div>`,
					}),
				),
				tr: markRaw(
					defineComponent({
						template: `<div class="tr"><slot></slot></div>`,
					}),
				),
				th: markRaw(
					defineComponent({
						template: `<div class="th"><slot></slot></div>`,
					}),
				),
				td: markRaw(
					defineComponent({
						template: `<div class="td"><slot></slot></div>`,
					}),
				),
			},
		},
	})

	expect(output.html()).toBe(`<div class="table" table="[object Object]">
  <div class="thead" head="[object Object]">
    <div class="tr" row="[object Object]">
      <div class="th" cell="[object Object]">
        <p>
          <!--v-if-->Method
        </p>
      </div>
      <div class="th" cell="[object Object]">
        <p>
          <!--v-if-->Usage
        </p>
      </div>
    </div>
  </div>
  <div class="tbody" body="[object Object]">
    <div class="tr" row="[object Object]">
      <div class="th" cell="[object Object]">
        <p>
          <!--v-if-->GET
        </p>
      </div>
      <div class="td" cell="[object Object]">
        <p>
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </div>
    </div>
    <div class="tr" row="[object Object]">
      <div class="th" cell="[object Object]">
        <p>
          <!--v-if-->DELETE
        </p>
      </div>
      <div class="td" cell="[object Object]">
        <p>
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </div>
    </div>
  </div>
</div>`)
})

it("renders custom table cell content", () => {
	const output = mount(PrismicTable, {
		props: {
			field: filledTableField,
			components: {
				table: markRaw(
					defineComponent({
						template: `<table class="table"><slot></slot></table>`,
					}),
				),
				paragraph: markRaw(
					defineComponent({
						template: `<p class="paragraph"><slot></slot></p>`,
					}),
				),
			},
		},
	})

	expect(output.html()).toBe(`<table class="table" table="[object Object]">
  <thead>
    <tr>
      <th>
        <p class="paragraph" node="[object Object]">
          <!--v-if-->Method
        </p>
      </th>
      <th>
        <p class="paragraph" node="[object Object]">
          <!--v-if-->Usage
        </p>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>
        <p class="paragraph" node="[object Object]">
          <!--v-if-->GET
        </p>
      </th>
      <td>
        <p class="paragraph" node="[object Object]">
          <!--v-if-->For <strong><!--v-if-->basic retrieval</strong>
          <!--v-if--> of information…
        </p>
      </td>
    </tr>
    <tr>
      <th>
        <p class="paragraph" node="[object Object]">
          <!--v-if-->DELETE
        </p>
      </th>
      <td>
        <p class="paragraph" node="[object Object]">
          <!--v-if-->To <em><!--v-if-->dest</em>
          <!--v-if-->roy a resource and remove…
        </p>
      </td>
    </tr>
  </tbody>
</table>`)
})
