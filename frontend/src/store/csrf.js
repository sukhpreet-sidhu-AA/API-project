import Cookies from 'js-cookie'

export const csrfFetch = async (url, options = {}) => {

    if (!options.headers) options.headers = {}

    if (!options.method) options.method = 'GET'

    if (options.method !== 'GET') {
        options.headers['Content-Type'] =
            options.headers['Content-Type'] || 'application/json';
        options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
    }

    const res = await window.fetch(url, options)

    if(res.status >= 400) throw res

    return res
}

export function restoreCSRF() {
    return csrfFetch('/api/csrf/restore');
  }