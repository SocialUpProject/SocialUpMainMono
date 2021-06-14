<template>
  <v-responsive max-width="260">
    <v-text-field
      v-model.trim="search"
      dense
      flat
      hide-details
      rounded
      solo-inverted
      @input="
        $router.replace({
          name: 'People',
          query: { search: $event.trim().toLowerCase() },
        })
      " />
  </v-responsive>
</template>
<script>
export default {
  name: 'SearchBar',

  data() {
    return {
      search: '',
    };
  },

  watch: {
    '$route.query.search': {
      immediate: true,
      handler(val) {
        this.search = val;
      },
    },
  },
};
</script>

<style scoped></style>
