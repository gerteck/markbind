<!-- eslint-disable vue/no-v-html -->
<template>
  <div :class="[addClass, 'printable-tabs']">
    <!-- Nav tabs -->
    <ul
      class="nav nav-tabs d-print-none"
      :class="getNavStyleClass"
      role="tablist"
    >
      <template v-for="(t, index) in headers">
        <!-- Tab -->
        <li
          v-if="!t._tabgroup"
          :key="index"
          class="nav-item"
          @click.prevent="select(t)"
        >
          <a
            class="nav-link"
            :class="{active: t.active, disabled:t.disabledBool}"
            href="#"
          ><span v-html="t.headerRendered"></span></a>
        </li>
        
        <!-- TabGroup -->
        <!-- TODO: Problem is heree, header is not recognised for some reason -->
        <!-- Throws the header from TabGroup to dropdown to process -->
        <!-- However, dropdown just saves it as an attribute and not a slot -->

        <dropdown
          v-else
          :key="index"
          class="nav-item"
          :header="t.headerRendered"
          :class="{active:t.active}"
          :disabled="t.disabled"
        >
          <!-- This works, but doesnt seem to fix it a the core -->
           <!-- TODO  -->

          <!-- <template v-slot:header>
            <span v-html="t.headerRendered"></span>
          </template> -->
          <li v-for="(tab, tabIndex) in t.tabs" :key="tabIndex">
            <a
              class="nav-link"
              :class="{disabled:tab.disabled}"
              href="#"
              @click.prevent="select(tab)"
              v-html="tab.headerRendered"
            ></a>
          </li>
        </dropdown>
      </template>
    </ul>

    <!-- Nav Content -->
    <div ref="tab-content" class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { toNumber } from './utils/utils';
import dropdown from './Dropdown.vue';

export default {
  components: {
    dropdown,
  },
  props: {
    navStyle: {
      type: String,
      default: 'tabs',
    },
    active: {
      type: String,
      default: '0',
    },
    addClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      show: null,
      headers: [],
      activeNumber: toNumber(this.active),
      tabs: [],
    };
  },
  created() {
    this._tabset = true;
  },
  computed: {
    getNavStyleClass() {
      return `nav-${this.navStyle}`;
    },
  },
  watch: {
    activeNumber(val) {
      this.show = this.tabs[val];
    },
  },
  mounted() {
    this.show = this.tabs[this.activeNumber];
  },
  methods: {
    select(tab) {
      if (!tab.disabled) {
        this.activeNumber = tab.index;
      }
    },
  },
};
</script>

<style scoped>
    .nav-tabs {
        margin-bottom: 15px;
    }

    .tab-content {
        margin-bottom: 1.5rem;
    }

    @media print {
        .printable-tabs {
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 20px;
        }
    }
</style>
