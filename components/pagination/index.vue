<template>
  <ul class="cn-pagination">
    <li class="cn-pagination__item"
        :class="{'is-disabled': 1 === currentPage}"
        @click="setCurrentPage('prev')">
      <slot name="prev">
        <i class="cn-icon-arrow_left"></i>
      </slot>
    </li>
    <li class="cn-pagination__item"
        v-for="pager in leftPagers"
        :key="pager"
        :class="{'is-active': pager === currentPage}"
        @click="setCurrentPage(pager)">
      {{pager}}
    </li>
    <li class="cn-pagination__item"
        v-if="showPrevMore"
        @mouseenter="quickprevIconName = 'cn-icon-db-arrow_left'"
        @mouseleave="quickprevIconName = 'cn-icon-more'"
        @click="setCurrentPage('prevMore')">
      <i class="cn-pagination__icon" :class="quickprevIconName"></i>
    </li>
    <li class="cn-pagination__item"
        v-for="pager in pagers"
        :key="pager"
        :class="{'is-active': pager === currentPage}"
        @click="setCurrentPage(pager)">
      {{pager}}
    </li>
    <li class="cn-pagination__item"
        v-if="showNextMore"
        @mouseenter="quicknextIconName = 'cn-icon-db-arrow_right'"
        @mouseleave="quicknextIconName = 'cn-icon-more'"
        @click="setCurrentPage('nextMore')">
      <i class="cn-pagination__icon" :class="quicknextIconName"></i>
    </li>
    <li class="cn-pagination__item"
        v-for="pager in rightPagers"
        :key="pager"
        :class="{'is-active': pager === currentPage}"
        @click="setCurrentPage(pager)">
      {{pager}}
    </li>
    <li class="cn-pagination__item"
        :class="{'is-disabled': pageCount === currentPage}"
        @click="setCurrentPage('next')">
      <slot name="next">
        <i class="cn-icon-arrow_right"></i>
      </slot>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'CnPagination',

    props: {
      currentPage: Number,
      pageCount: Number,
      pageRange: {
        type: Number,
        default: 5
      },
      edgePages: {
        type: Number,
        default: 1
      }
    },

    data () {
      return {
        quickprevIconName: 'cn-icon-more',
        quicknextIconName: 'cn-icon-more',
        showPrevMore: false,
        showNextMore: false
      };
    },

    watch: {
      showPrevMore (val) {
        if (!val) this.quickprevIconName = 'cn-icon-more';
      },
      showNextMore (val) {
        if (!val) this.quicknextIconName = 'cn-icon-more';
      }
    },

    computed: {
      pagers () {
        const pageRange = Number(this.pageRange);
        const edgePages = Number(this.edgePages);
        const currentPage = Number(this.currentPage);
        const pageCount = Number(this.pageCount);
        const pagerCount = pageRange + edgePages * 2;
        let showPrevMore = false;
        let showNextMore = false;
        if (pageCount > pagerCount) {
          let half = Math.ceil(pagerCount / 2) - 1;
          if (currentPage > pagerCount - half) {
            showPrevMore = true;
          }
          if (currentPage < pageCount - half) {
            showNextMore = true;
          }
        }
        const array = [];
        if (showPrevMore && !showNextMore) {
          const startPage = pageCount - (pagerCount - 2);
          for (let i = startPage + 1; i <= pageCount - edgePages; i++) {
            array.push(i);
          }
        } else if (!showPrevMore && showNextMore) {
          for (let i = edgePages + 1; i <= pagerCount - edgePages; i++) {
            array.push(i);
          }
        } else if (showPrevMore && showNextMore) {
          const offset = Math.ceil(pagerCount / 2) - 1 - edgePages;
          const endPage = pagerCount % 2 === 1
            ? currentPage + offset
            : currentPage + offset + 1;
          for (let i = currentPage - offset; i <= endPage; i++) {
            array.push(i);
          }
        } else {
          for (let i = edgePages + 1; i <= pageCount - edgePages; i++) {
            array.push(i);
          }
        }
        this.showPrevMore = showPrevMore;
        this.showNextMore = showNextMore;
        return array;
      },
      leftPagers () {
        let edgePages = this.edgePages;
        let pageCount = this.pageCount;
        let array = [];
        if (pageCount < edgePages) {
          for (let i = 1; i <= pageCount; i++) {
            array.push(i);
          }
        } else {
          for (let i = 1; i <= edgePages; i++) {
            array.push(i);
          }
        }
        return array;
      },
      rightPagers () {
        let edgePages = this.edgePages;
        let pageCount = this.pageCount;
        let array = [];
        if (pageCount < edgePages * 2) {
          for (let i = edgePages + 1; i <= pageCount; i++) {
            array.push(i);
          }
        } else {
          for (let i = pageCount - edgePages + 1; i <= pageCount; i++) {
            array.push(i);
          }
        }
        return array;
      }
    },

    methods: {
      setCurrentPage (pager) {
        let newPage = this.currentPage;
        let pageRange = this.pageRange;
        if (typeof pager === 'string' && isNaN(Number(pager))) { // 如果是 < 或 > 或 ...
          switch (pager) {
            case 'prev':
              newPage--;
              break;
            case 'next':
              newPage++;
              break;
            case 'prevMore':
              newPage -= pageRange;
              break;
            case 'nextMore':
              newPage += pageRange;
              break;
            default:
              break;
          }
        } else {
          newPage = Number(pager);
        }
        if (!isNaN(newPage)) {
          if (newPage < 1) {
            newPage = 1;
          }
          if (newPage > this.pageCount) {
            newPage = this.pageCount;
          }
        }
        if (newPage !== this.currentPage) {
          this.$emit('change', newPage);
        }
      }
    }
  };
</script>
