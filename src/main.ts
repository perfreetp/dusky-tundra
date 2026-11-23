import { createApp } from 'vue';
import App from './App.vue';
import { useStore } from './store';
import './style.css';

createApp(App).mount('#app');

// 调试/自动化测试钩子：暴露解包后的 store 接口以便 CDP 冒烟测试直接验证数据回路
if (import.meta.env.DEV) {
  const store = useStore();
  (window as unknown as {
    __store: Omit<ReturnType<typeof useStore>, 'state' | 'activeCurve' | 'activeVariety' | 'totalGdd'> & {
      state: ReturnType<typeof useStore>['state'];
      totalGdd: number;
      activeCurve: ReturnType<typeof useStore>['activeCurve']['value'];
      activeVariety: ReturnType<typeof useStore>['activeVariety']['value'];
    };
  }).__store = {
    ...store,
    get state() {
      return store.state;
    },
    get totalGdd() {
      return store.totalGdd.value;
    },
    get activeCurve() {
      return store.activeCurve.value;
    },
    get activeVariety() {
      return store.activeVariety.value;
    }
  };
}
