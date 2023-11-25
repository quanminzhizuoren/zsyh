
/**
 * 数字过渡动画
 * @param {number} form 初始值
 * @param {number} to 结束值
 * @param {function} callback 回调函数，每次调用时会传入当前的 t 值和 form 值，传入的to到form的进度
 * @param {number|function} over 结束回调或持续时间，如果是数字，则表示动画的持续时间，单位为毫秒；如果是函数，则表示动画结束时的回调函数
 * @param {number} time 动画的持续时间，单位为毫秒
 * @return {object} 一个包含以下方法的对象：
 *  - start() 开始动画
 *  - stop() 停止动画
 */
export const transitionNumber = (
  /**初始值 */
  form: number,
  /**结束值 */
  to: number,
  /**回调 */
  callback: (t: number, f: number) => void,
  /**结束回调或持续时间 */
  over: number | (() => void) = 300,
  /**持续时间 */
  time: number = 300
) => {
  const startTime = performance.now();
  let iscontinue = true
  let ms = typeof over === 'number' ? over : time;
  function step(reqtime: number) {
    if (!iscontinue) return
    const progress = (reqtime - startTime) / ms;
    if (progress >= 1) {
      typeof over === 'function' && over()
      return
    }
    callback(form * (1 - progress) + to * progress, form)
    requestAnimationFrame(step);
  }

  return {
    /**
     * 动画开始开始 
     * @param time 本次动画持续时间
     */
    start(time?: number) {
      if (time) ms = time
      requestAnimationFrame(step);
    },
    /**停止 */
    stop() {
      iscontinue = false
    }
  }
}