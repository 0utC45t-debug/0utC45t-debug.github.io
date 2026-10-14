(() => {
  const storageKey = 'blog-ui-language'
  const phraseMap = {
    '首页': 'Home',
    '归档': 'Archives',
    '标签': 'Tags',
    '分类': 'Categories',
    '友链': 'Links',
    '关于': 'About',
    '文章': 'Posts',
    '全部文章': 'All posts',
    '搜索': 'Search',
    '搜索文章': 'Search posts',
    '搜索文章标题或正文': 'Search titles or article text',
    '数据加载中': 'Loading search data',
    '发表于': 'Posted on',
    '更新于': 'Updated on',
    '总字数': 'Word count',
    '阅读时长': 'Reading time',
    '分钟': 'min',
    '浏览量': 'Page views',
    '评论数': 'Comments',
    '相关推荐': 'Related posts',
    '编辑': 'Edit',
    '返回首页': 'Back to home',
    '评论': 'Comments',
    '公告': 'Announcement',
    '最新文章': 'Recent posts',
    '网站信息': 'Site information',
    '文章数目': 'Posts',
    '运行时间': 'Uptime',
    '天': 'days',
    '最后更新时间': 'Last updated',
    '本站总字数': 'Total words',
    '本站访客数': 'Visitors',
    '本站总浏览量': 'Page views',
    '查看更多': 'View more',
    '加载更多': 'Load more',
    '最新评论': 'Recent comments',
    '加载中...': 'Loading...',
    '无法获取评论，请确认相关配置是否正确': 'Unable to load comments. Check the comment service settings.',
    '暂无评论': 'No comments yet',
    '图片': 'Image',
    '链接': 'Link',
    '代码': 'Code',
    '目录': 'Contents',
    '系列文章': 'Series',
    '刚刚': 'just now',
    '分钟前': 'min ago',
    '小时前': 'hours ago',
    '天前': 'days ago',
    '个月前': 'months ago',
    '赞助': 'Donate',
    '分享': 'Share',
    '阅读模式': 'Reading mode',
    '日间和夜间模式切换': 'Toggle light/dark mode',
    '回到顶部': 'Back to top',
    '前往评论': 'Go to comments',
    '设置': 'Settings',
    '单栏和双栏切换': 'Toggle sidebar',
    '聊天': 'Chat',
    '框架': 'Framework',
    '主题': 'Theme',
    '复制成功': 'Copied',
    '复制失败': 'Copy failed',
    '浏览器不支持': 'Not supported by this browser',
    '已切换为深色模式': 'Switched to dark mode',
    '已切换为浅色模式': 'Switched to light mode',
    '已切换为繁体中文': 'Switched to Traditional Chinese',
    '已切换为简体中文': 'Switched to Simplified Chinese',
    '无标题': 'Untitled',
    '上一篇': 'Older post',
    '下一篇': 'Newer post',
    '上一页': 'Previous page',
    '下一页': 'Next page',
    '页面未找到': 'Page not found',
    '本博客所有文章除特别声明外，均采用': 'Unless otherwise noted, articles on this blog are licensed under',
    '许可协议。转载请注明来源': ' . Please credit the source when reposting:',
    '著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。': 'Copyright belongs to the author. Contact the author for commercial reuse; credit the source for non-commercial reuse.',
    '欢迎聊聊这篇文章。评论无需登录，审核后公开。': 'Share your thoughts on this article. No login required; comments appear after moderation.'
  }
  const monthMap = {
    '一月': 'January', '二月': 'February', '三月': 'March', '四月': 'April',
    '五月': 'May', '六月': 'June', '七月': 'July', '八月': 'August',
    '九月': 'September', '十月': 'October', '十一月': 'November', '十二月': 'December'
  }
  const skipSelector = [
    'script', 'style', 'noscript', 'pre', 'code', 'textarea',
    '#article-container', '.post-content', '.post-title', '.article-sort-item-title',
    '.article-title', '#recent-posts .content', '.card-recent-post .title',
    '.card-post-series .title', '.relatedPosts .relatedPosts-item',
    '#page .category-lists a', '#page .tag-cloud-list a',
    '.post-meta-categories a', '.article-meta__categories', '.article-meta__tags',
    '.announcement_content', '#language-toggle',
    '.author-info-name', '.author-info-description', '.site-name',
    '.local-search-hit-item', '.relatedPosts-list'
  ].join(',')

  let language = 'zh'
  try {
    language = localStorage.getItem(storageKey) === 'en' ? 'en' : 'zh'
  } catch (_) {}
  let updateQueued = false
  const textState = new WeakMap()
  const attributeState = new WeakMap()

  const convertDynamicText = text => {
    let match

    match = text.match(/^共找到\s*(\d+)\s*篇文章$/)
    if (match) return `${match[1]} articles found`

    match = text.match(/^找到\s*(\d+)\s*条结果，耗时\s*(\d+)\s*毫秒$/)
    if (match) return `${match[1]} results in ${match[2]} ms`

    match = text.match(/^未找到符合您查询的内容：\s*(.*)$/)
    if (match) return `No matching content found: ${match[1]}`

    match = text.match(/^全部文章\s*[-—]\s*(\d+)$/)
    if (match) return `All posts - ${match[1]}`

    match = text.match(/^第\s*(\d+)\s*页\s*\/\s*共\s*(\d+)\s*页$/)
    if (match) return `Page ${match[1]} of ${match[2]}`

    match = text.match(/^(一月|二月|三月|四月|五月|六月|七月|八月|九月|十月|十一月|十二月)\s+(\d{4})$/)
    if (match) return `${monthMap[match[1]]} ${match[2]}`

    return text
  }

  const convertText = (value, targetLanguage) => {
    const leading = value.match(/^\s*/)[0]
    const trailing = value.match(/\s*$/)[0]
    const text = value.slice(leading.length, value.length - trailing.length || undefined)
    if (!text) return value

    const translated = targetLanguage === 'en'
      ? (phraseMap[text] || convertDynamicText(text))
      : text

    return `${leading}${translated}${trailing}`
  }

  const isSkipped = element => element && element.closest(skipSelector)

  const applyLanguage = () => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN'

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.data.trim() || isSkipped(node.parentElement)) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    })

    let node
    while ((node = walker.nextNode())) {
      let state = textState.get(node)
      if (!state) state = { source: node.data, last: node.data }
      else if (node.data !== state.last) state.source = node.data

      const translated = convertText(state.source, language)
      if (translated !== node.data) node.data = translated
      state.last = translated
      textState.set(node, state)
    }

    document.body.querySelectorAll('[title], [aria-label], [placeholder]').forEach(element => {
      if (isSkipped(element)) return
      let state = attributeState.get(element)
      if (!state) state = {}
      for (const attribute of ['title', 'aria-label', 'placeholder']) {
        const value = element.getAttribute(attribute)
        if (!value) continue

        let attributeEntry = state[attribute]
        if (!attributeEntry) attributeEntry = { source: value, last: value }
        else if (value !== attributeEntry.last) attributeEntry.source = value

        const translated = convertText(attributeEntry.source, language)
        if (translated !== value) element.setAttribute(attribute, translated)
        attributeEntry.last = translated
        state[attribute] = attributeEntry
      }
      attributeState.set(element, state)
    })

    const toggle = document.getElementById('language-toggle')
    if (toggle) {
      const label = language === 'zh' ? 'EN' : '中'
      const title = language === 'en' ? 'Switch interface to Chinese' : 'Switch interface to English'
      if (toggle.textContent !== label) toggle.textContent = label
      if (toggle.title !== title) toggle.title = title
      if (toggle.getAttribute('aria-label') !== title) toggle.setAttribute('aria-label', title)
    }
  }

  const createToggle = () => {
    if (document.getElementById('language-toggle')) return
    const darkmodeButton = document.getElementById('darkmode')
    const settingsGroup = document.getElementById('rightside-config-hide')
    if (!settingsGroup || !darkmodeButton) return

    const button = document.createElement('button')
    button.id = 'language-toggle'
    button.type = 'button'
    button.textContent = language === 'zh' ? 'EN' : '中'
    button.addEventListener('click', () => {
      language = language === 'zh' ? 'en' : 'zh'
      try {
        localStorage.setItem(storageKey, language)
      } catch (_) {}
      applyLanguage()
    })
    settingsGroup.insertBefore(button, darkmodeButton)
  }

  const scheduleUpdate = () => {
    if (updateQueued) return
    updateQueued = true
    requestAnimationFrame(() => {
      updateQueued = false
      createToggle()
      applyLanguage()
    })
  }

  const initialize = () => {
    createToggle()
    applyLanguage()
    new MutationObserver(scheduleUpdate).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['title', 'aria-label', 'placeholder']
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true })
  } else {
    initialize()
  }
})()
