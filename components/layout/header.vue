<template>
  <div class="navbar">
    <div class="navbar__inner">
      <div class="navbar__container">
        <div class="navbar__site">
          <nuxt-link class="navbar__brand" to="/">
            <img src="//static2.cnodejs.org/public/images/cnodejs_light.svg" alt="Cnode 中文社区" />
          </nuxt-link>
          <!-- <form class="navbar__search" action="/search">
            <i class="cn-icon-search"></i>
            <input type="text" id="q" name="q" />
          </form>-->
        </div>
        <div class="navbar__nav">
          <span>
            <nuxt-link to="/">首页</nuxt-link>
          </span>
          <span v-show="user">
            <nuxt-link to="/my/messages">未读消息</nuxt-link>
          </span>
          <span>
            <nuxt-link to="/about">关于</nuxt-link>
          </span>
          <span class="navbar__nossr" v-show="user">
            <nuxt-link to="/setting">设置</nuxt-link>
            <span class="navbar__logout" @click="$store.dispatch('LOGOUT')">退出</span>
          </span>
          <span class="navbar__nossr" v-show="!user">
            <nuxt-link to="/signin">登录</nuxt-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'defaultLayout',

  computed: {
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style lang="scss">
@include b(navbar) {
  position: relative;
  z-index: 9;
  width: 100%;
  margin-bottom: 0;
  font-size: 13px;
  background: #444;

  @include e(inner) {
    width: 90%;
    min-height: 50px;
    margin: auto;
    padding: 5px;
    background: 0 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }

  @include e(container) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    min-width: 960px;
    margin: 0 auto;
    max-width: 1400px;
  }

  @include e(site) {
    display: flex;
    justify-content: flex-start;
  }

  @include e(brand) {
    width: 160px;
    margin-left: -20px;
    padding: 3px 20px;
    height: 40px;
    color: #ccc;
    font-weight: 700;
  }

  @include e(search) {
    position: relative;
    display: flex;
    align-items: center;

    i {
      position: absolute;
      left: 3px;
      color: #a5a6a5;
    }

    input {
      width: 233px;
      height: 26px;
      padding: 3px 5px 3px 22px;
      font-size: 13px;
      font-weight: 400;
      line-height: 1;
      color: #666;
      background: url(//static2.cnodejs.org/public/images/search.e53b380a.hashed.png)
        4px 4px no-repeat #888;
      border: 0;
      border-radius: 15px;
      transition: all 0.5s;

      &:focus {
        background-color: #fff;
        border-color: rgba(82, 168, 236, 0.8);
        outline: 0;
        box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
          0 0 8px rgba(82, 168, 236, 0.6);
      }
    }
  }

  @include e(nav) {
    display: flex;
    align-items: center;

    a,
    .navbar__logout {
      display: block;
      padding: 10px 15px;
      line-height: 20px;
      color: #ccc;
      cursor: pointer;

      &:hover {
        color: #fff;
      }
    }

    .navbar__nossr {
      a,
      span {
        display: inline-block;
      }
    }
  }
}

@media screen and (max-width: $--break-large) {
  .navbar__container {
    display: block;
    min-width: 0;
  }
}

@media screen and (max-width: $--break-small) {
  .navbar__inner {
    width: 100%;
  }

  .navbar__site {
    align-items: center;
    flex-direction: column;
  }

  .navbar__nav {
    flex-wrap: wrap;
  }
}

@media screen and (max-width: $--break-mini) {
  .navbar__nav {
    justify-content: center;

    a {
      padding: 10px;
    }
  }
}
</style>
