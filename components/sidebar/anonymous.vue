<template>
  <sidebar-wrapper>
    <p class="anonymous__community">CNode：Node.js专业中文社区</p>
    <div>
      <a class="anonymous__signin" href="/signin">点击登录</a>
    </div>
  </sidebar-wrapper>
</template>

<script>
import SidebarWrapper from './sidebar-wrapper';
export default {
  name: 'Anonymous',

  components: {
    SidebarWrapper
  }
};
</script>

<style lang="scss">
@include b(anonymous) {
  @include e(community) {
    font-size: 14px;
    margin-bottom: 10px;
  }

  // @include p('e:signin', 'e:signup') {
  //   @include hover {
  //     text-decoration: underline;
  //   }
  // }

  @include e(signin) {
    @include hover {
      text-decoration: underline;
    }
  }

  @include e(signup) {
    @include hover {
      text-decoration: underline;
    }
  }

  @include e(github) {
    display: inline-block;
  }
}
</style>
