// @ts-nocheck
import dedent from 'ts-dedent'
import { createApp, h, shallowRef } from 'vue'
import { RenderContext } from './types'

export const COMPONENT = 'STORYBOOK_COMPONENT'
export const VALUES = 'STORYBOOK_VALUES'

let mounted = false

const activeComponent = shallowRef(null)
export const props = shallowRef({})

const root = createApp({
  render() {

    const children = activeComponent.value ? [ h(activeComponent.value) ] : undefined

    return h('div', { attrs: { id: 'root' } }, children)

  }
})

// const root = new Vue({
//   data() {
//     return {
//       [ COMPONENT ]: undefined,
//       [ VALUES ]: {}
//     }
//   },
//   render(h) {
//     const children = this[ COMPONENT ] ? [ h(this[ COMPONENT ]) ] : undefined
//     return h('div', { attrs: { id: 'root' } }, children)
//   }
// })

export default function render({ storyFn, kind, name, showMain, showError, showException, forceRender }: RenderContext) {

  root.config.errorHandler = showException

  const element = storyFn()

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${ name }" of "${ kind }".`,
      description: dedent`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `
    })
    return
  }

  showMain()

  // always refresh the component
  activeComponent.value = element

  //
  // // @ts-ignore https://github.com/storybookjs/storybook/pull/7578#discussion_r307986139
  // root[ VALUES ] = element.options[ VALUES ]

  // if (!root.$el) {
  //   root.$mount('#root')
  // }

  if (!mounted) {
    root.mount('#root')
    mounted = true
  }

}
