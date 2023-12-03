

type Callback = (t: number, f: number, option: Return) => void
type Return = {
  /**
   * 动画开始 
   * @param time 本次动画持续时间
   */
  start(time?: number): void;
  /**停止 */
  stop(): void;
}

export function transitionNumber(form: number, to: number, callback: Callback,): Return;
export function transitionNumber(form: number, to: number, callback: Callback, time: number): Return;
export function transitionNumber(form: number, to: number, callback: Callback,/*结束回调*/ over: Function): Return;
export function transitionNumber(form: number, to: number, callback: Callback,/*结束回调*/ over: Function, time: number): Return;

export function transitionNumber(form: number[], to: number[], callback: Callback,): Return;
export function transitionNumber(form: number[], to: number[], callback: Callback, time: number): Return;
export function transitionNumber(form: number[], to: number[], callback: Callback,/*结束回调*/ over: Function): Return;
export function transitionNumber(form: number[], to: number[], callback: Callback,/*结束回调*/ over: Function, time: number): Return;

/**
 * 数字过渡动画
 * @param {number|number[]} form 初始值
 * @param {number|number[]} to 结束值
 * @param {function} callback 回调函数，每次调用时会传入当前的 t 值和 form 值，传入的to到form的进度
 * @param {number|function} over 结束回调或持续时间，如果是数字，则表示动画的持续时间，单位为毫秒；如果是函数，则表示动画结束时的回调函数
 * @param {number} time 动画的持续时间，单位为毫秒
 * @return {object} 一个包含以下方法的对象：
 *  - start() 开始动画
 *  - stop() 停止动画
 */
export function transitionNumber(
  form: number | number[],
  to: number | number[],
  callback: Callback,
  over: number | Function = 300,
  time: number = 300
) {

  const startTime = performance.now();
  let iscontinue = true
  let ms = typeof over === 'number' ? over : time

  const option = {
    start(time?: number) {
      if (time) ms = time
      requestAnimationFrame(step);
    },
    stop() {
      iscontinue = false
    }
  }
  function step(reqtime: number) {
    if (!iscontinue) return
    const progress = (reqtime - startTime) / ms;
    if (progress >= 1) {
      typeof over === 'function' && over()
      return
    }
    if (typeof form === 'number' && typeof to === 'number') {
      callback(form * (1 - progress) + to * progress, form, option)
    } else if (Array.isArray(form) && Array.isArray(to) && form.length === to.length) {
      for (let index in form) {
        callback(form[index] * (1 - progress) + to[index] * progress, form[index], option)
      }
    } else throw new TypeError('只能是数字')
    requestAnimationFrame(step);
  }
  return option
}