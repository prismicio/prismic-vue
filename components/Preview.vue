<template>
  <div>
    <p>Loading the Prismic Preview...</p>
  </div>
</template>

<script>
import Cookie from 'js-cookie';

export default {
  name: 'PrismicPreview',
  beforeCreate () {
    const previewToken = this.$route.query.token;

    this.$prismic.getApi(this.$prismic.endpoint).then((api) => {
      api.previewSession(previewToken, this.$prismic.linkResolver, '/').then((url) => {
        Cookie.set(this.$prismic.previewCookie, previewToken, { expires: '30m' });
        window.location.replace(url);
      });
    });
  }
};
</script>
