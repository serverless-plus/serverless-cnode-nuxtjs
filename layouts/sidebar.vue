<template>
  <div class="cnode">
    <Header />
    <div class="main">
      <nuxt nuxt-child-key="none" role="main" />
      <div class="main__sidebar sidebar">
        <anonymous v-if="!user"></anonymous>
        <template v-else>
          <personal :user="user"></personal>
          <create-topic></create-topic>
        </template>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/layout/header';
import Footer from '~/components/layout/footer';
import Anonymous from '~/components/sidebar/anonymous';
import Personal from '~/components/sidebar/personal';
import CreateTopic from '~/components/sidebar/create-topic';

export default {
  name: 'sidebarLayout',

  components: {
    Header,
    Footer,
    Anonymous,
    Personal,
    CreateTopic
  },

  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>
