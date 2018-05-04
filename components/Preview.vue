<template>
  <div>
    <p>Loading the Prismic Preview...</p>
  </div>
</template>

<script>
export default {
  name: 'PrismicPreview',
  beforeCreate () {
    const previewToken = this.$route.query.token;

    this.$prismic.getApi(this.$prismic.endpoint).then((api) => {
      api.previewSession(previewToken, this.$prismic.linkResolver, '/').then((url) => {
        this.$cookie.set(this.$prismic.previewCookie, previewToken, { expires: '30m' });
        window.location.replace(url);
      });
    });
  }
};
</script>
