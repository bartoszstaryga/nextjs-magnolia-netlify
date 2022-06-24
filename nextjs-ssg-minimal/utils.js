export const languages = process.env.NEXT_PUBLIC_MGNL_LANGUAGES.split(' ');

export function getCurrentLanguage(url) {
  for (let i = 0; i < languages.length; i++) {
    const language = languages[i];

    if (url.indexOf('/' + language) > -1) return language;
  }

  return languages[0];
}

export function setURLSearchParams(url, param) {
  return url + (url.indexOf('?') > -1 ? '&' : '?') + param;
}
