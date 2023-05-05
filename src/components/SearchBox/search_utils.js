/**
 * 创建css样式, 用于设置高亮的颜色
 * @param {String} css 
 */
function createCssStyle(css) {
  const style = document.createElement('style')
  style.type = 'text/css'
  try {
    style.appendChild(document.createTextNode(css))
  } catch (ex) {
    style.styleSheet.cssText = css
  }
  document.getElementsByTagName('head')[0].appendChild(style)
}

/**
 * 遍历node节点的所有文本节点, 对每个文本节点调用callback
 * @param {Node} node
 * @param {Function} callback
 */
function traverseTextDom(node, callback) {
  if (node.nodeType === Node.TEXT_NODE) { // text node
    callback(node)
  } else if (node.nodeType === Node.ELEMENT_NODE) { // element node
    for (let i = 0; i < node.childNodes.length; i++) {
      traverseTextDom(node.childNodes[i], callback)
    }
  }
}

/**
 * 将高亮的dom节点列表转换并合并为一个文本节点
 * @param {List} domList 
 * @returns 
 */
function convertHighlightDomToTextNode (domList) {
  if (!domList || !domList.length) { return }
  domList.forEach(dom => {
    if (dom && dom.parentNode) {
      const parent = dom.parentNode
      const textNode = document.createTextNode(dom.textContent)
      parent.insertBefore(textNode, dom)
      parent.removeChild(dom)
      parent.normalize() // 合并相邻的文本节点
    }
  })
}

/**
 * 获取高亮的dom列表
 * @param {Node} node
 * @param {Array} domIndexList
 * @param {String} highlightClass
 * @returns {Array} domList 
 */
function getHighlightdomList(node, domIndexList, highlightClass) {
  const nodeList = []
  const callback = (node) => { nodeList.push(node) }
  traverseTextDom(node, callback)
  let currentTextIndex = 0
  let nextDomIndexIndex = 0
  let nextDomIndex = domIndexList[nextDomIndexIndex]
  const domList = []
  nodeList.forEach(node => {
    const parent = node.parentNode
    const text = node.nodeValue.trim()
    const len = text.length
    if (!parent || !text || !len) { return }
    const textList = []
    for (let i = 0; i < len; i++) {
      if (i + currentTextIndex === nextDomIndex) {
        nextDomIndex = domIndexList[++nextDomIndexIndex]
        textList.push(`<span class="${highlightClass}">${text[i]}</span>`)
      } else {
        textList.push(text[i])
      }
    }
    if (textList.length) {
      const tempNode = document.createElement('span')
      tempNode.innerHTML = textList.join('')
      const children = tempNode.children
      if (children) {
        for (let i = 0; i < children.length; i++) {
          domList.push(children[i])
        }
      }
      // 将节点插入到parent的指定位置
      // insertBofore会将节点从原来的位置移除，导致索引错误，所以不能用forEach
      while (tempNode.firstChild) {
        parent.insertBefore(tempNode.firstChild, node)
      }
      parent.removeChild(node)
    }
    currentTextIndex += len
  })
  return domList
}

/**
 * 获取搜索结果
 * @param {String} selector 
 * @param {String} searchContent 
 * @param {List} searchResult 
 * @param {String} highlightClass 
 * @returns 
 */
function getSearchResult(selector, searchContent, searchResult, highlightClass) {
  const container = document.querySelector(selector)
  if (!container || !searchContent) { return }
  let text = ''
  const callback = (node) => { text += node.nodeValue.trim() }
  traverseTextDom(container, callback)
  if (!text) { return }
  // 获取所有匹配结果的索引(每个匹配结果的第一个字符所在位置)
  const indexList = []
  let index = text.indexOf(searchContent)
  while (index !== -1) {
    indexList.push(index)
    index = text.indexOf(searchContent, index + 1)
  }
  if (!indexList.length) { return }
  // 获取所有需要高亮的文本索引(每个匹配结果的所有字符所在位置)
  const domIndexList = [indexList[0]]
  const searchLen = searchContent.length
  for (let i = 0; i < indexList.length; i++) {
    for (let j = indexList[i]; j < indexList[i] + searchLen; j++) {
      if (j > domIndexList[domIndexList.length - 1]) {
        domIndexList.push(j)
      }
    }
  }
  // 高亮节点并保存
  const domList = getHighlightdomList(container, domIndexList, highlightClass)
  indexList.forEach((index) => {
    const start = domIndexList.indexOf(index)
    if (start !== -1) {
      const temp = { domList: [], selector: selector }
      for (let i = start; i < start + searchLen; i++) {
        temp.domList.push(domList[i])
      }
      searchResult.push(temp)
    }
  })
}

export class SearchBoxUtil {

  static instanceCount = 0

  /**
   * 清除搜索的数据
   */
  clearSearchData() {
    this.searchContent = ''
    this.currentIndex = -1
    for (const result of this.searchResult) {
      convertHighlightDomToTextNode(result.domList)
    }
    this.searchResult = []
  }

  /**
   * @param {String} highlightColor 
   * @param {String} currentColor 
   */
  constructor(highlightColor = 'rgb(246, 186, 130)', currentColor = 'rgb(246, 137, 31)') {
    SearchBoxUtil.instanceCount++
    this.highlightClass = 'search-box-highlight-' + SearchBoxUtil.instanceCount
    this.currentClass = 'search-box-current-' + SearchBoxUtil.instanceCount
    const css = `.${this.highlightClass} { background-color: ${highlightColor}; } .${this.currentClass} { background-color: ${currentColor}; }`
    createCssStyle(css)
    this.searchResult = []
    this.clearSearchData()
  }

  /**
   * 设置搜索的位置
   * @param {List} selectorList 
   */
  setSelectorList(selectorList) {
    this.selectorList = selectorList
    this.clearSearchData()
  }

  /**
   * 搜索
   * @param {String} searchContent 
   * @param {List} selectorList 
   * @returns 
   */
  search(searchContent, selectorList = null) {
    if (selectorList) {
      this.setSelectorList(selectorList)
    }
    if (!this.selectorList || !this.selectorList.length) { return }
    this.clearSearchData()
    this.searchContent = searchContent
    if (this.searchContent) {
      this.selectorList.forEach((selector) => {
        getSearchResult(selector, searchContent, this.searchResult, this.highlightClass)
      })
    }
    return this.searchResult.length
  }

  /**
   * 设置当前结果
   * @param {Number} index 
   */
  setCurrent(index) {
    const lastSelector = this.searchResult[this.currentIndex] ? this.searchResult[this.currentIndex].selector : null
    const currentSelector = this.searchResult[index] ? this.searchResult[index].selector : null
    this.beforeJump && this.beforeJump(index, currentSelector, this.currentIndex, lastSelector)
    if (this.currentIndex >= 0 && this.currentIndex < this.searchResult.length) {
      this.searchResult[this.currentIndex].domList.forEach((dom) => {
        dom.classList.remove(this.currentClass)
      })
    }
    this.currentIndex = index
    if (this.currentIndex >= 0 && this.currentIndex < this.searchResult.length) {
      this.searchResult[this.currentIndex].domList.forEach((dom) => {
        dom.classList.add(this.currentClass)
      })
    }
    this.afterJump && this.afterJump(index, currentSelector, this.currentIndex, lastSelector)
  }

  /**
   * 跳转到前一个
   */
  searchPrevious() {
    this.setCurrent((this.currentIndex - 1 + this.searchResult.length) % this.searchResult.length)
  }

  /**
   * 跳转到后一个
   */
  searchNext() {
    this.setCurrent((this.currentIndex + 1) % this.searchResult.length)
  }

  /**
   * 设置跳转结果前后的回调
   * callback(currentIndex, currentSelector, lastIndex, lastSelector)
   * @param {Function} beforeJump 
   * @param {Function} afterJump 
   */
  setJumpCallback(beforeJump, afterJump) {
    beforeJump && (this.beforeJump = beforeJump)
    afterJump && (this.afterJump = afterJump)
  }
}

