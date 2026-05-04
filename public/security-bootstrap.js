;(function () {
  var params = new URLSearchParams(location.search)
  var redirect = params.get('redirect')
  if (redirect) {
    params.delete('redirect')
    var cleaned = params.toString()
    var base = location.pathname
    var next = redirect + (cleaned ? (redirect.indexOf('?') === -1 ? '?' : '&') + cleaned : '')
    history.replaceState(null, '', base + next)
  }

  if (typeof window.AOS !== 'undefined' && typeof window.AOS.init === 'function') {
    window.AOS.init()
  }
})()
