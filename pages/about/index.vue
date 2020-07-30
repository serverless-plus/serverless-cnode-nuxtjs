<template>
  <div class="main__content">
    <div class="main__panel">
      <div class="main__header">
        <breadcrumb>
          <breadcrumb-item to="/">主页</breadcrumb-item>
          <breadcrumb-item>关于</breadcrumb-item>
        </breadcrumb>
      </div>
      <div class="about">
        <div class="markdown-text">
          <h2>Serverless CNode 客户端</h2>
          <dt>关于项目</dt>
          <dd>
            使用 Nuxt.js 开发，并且基于 Serverless 部署的 CNode
            客户端
          </dd>
          <dt>源码地址</dt>
          <dd>
            <a
              target="_blank"
              href="https://github.com/serverless-plus/serverless-cnode-nuxtjs"
            >https://github.com/serverless-plus/serverless-cnode-nuxtjs</a>
          </dd>
          <dt>意见反馈</dt>
          <dd>
            <a
              target="_blank"
              href="https://github.com/serverless-plus/serverless-cnode-nuxtjs/issues"
            >发表意见或者提需求</a>
          </dd>
          <dt>当前版本</dt>
          <dd>V0.1.0</dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '~/components/breadcrumb';
import BreadcrumbItem from '~/components/breadcrumb/item';

export default {
  name: 'about',

  layout: 'sidebar',

  components: {
    Breadcrumb,
    BreadcrumbItem
  }
};
</script>

<style lang="scss">
@include b(about) {
  padding: 10px;
  border-top: 1px solid #e5e5e5;

  h2 {
    font-size: 26px;
  }

  dt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  dd {
    margin-left: 0;
    margin-bottom: 20px;
  }
}
</style>
