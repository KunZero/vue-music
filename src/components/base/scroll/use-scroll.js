import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

export default function useScroll(wrapperRef, options, emit) {
  // 声明了scroll响应式变量，成为实例的属性了 （null：空对象）
  const scroll = ref(null)

  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })
    // console.log('scrollVal: ', scrollVal)
    // console.log('scroll: ', scroll)
    // window.scrollVal = scrollVal
    // window.scroll = scroll.value
    if (options.probeType > 0) {
      // 监听scroll事件 ， pos应该是这个回调函数带过来的参数
      scrollVal.on('scroll', (pos) => {
        // 执行父组件派发的自定义事件scroll ， 并传入参数pos
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
