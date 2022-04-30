import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title
    })
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    // e是一个TouchEvent事件对象，通过e.target可以获取到touch事件作用的DOM对象 ； e.touches[0]可以获取Touch对象，下面有许多坐标相关的属性
    // e.target.dataset.index 来自于 :data-index="index"
    // console.log('e: ', e)
    // 调试完尽量注释window的全局变量赋值，避免变量名污染
    // window.e = e
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    // Num | 0 是位运算，这里目的是取整的偏移量
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta

    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    // 避免触摸容器时返回index为NaN的情况
    if (isNaN(index)) {
      return
    }
    // console.log('shortcutList: ', shortcutList)
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    // console.log('scrollRef.value: ', scrollRef.value)
    // window.scrollRefVal = scrollRef.value
    const scroll = scrollRef.value.scroll
    // 通过层层传递得知scroll是BScroll的实例，调用scrollToElement方法实现滚动跳转
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
