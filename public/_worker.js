// Canonical host redirects are not supported by Pages' _redirects file.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (['amma-nana-foods.pages.dev', 'www.amma-nana-foods.com'].includes(url.hostname)) {
      url.hostname = 'amma-nana-foods.com';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
