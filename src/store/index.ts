// store/index.ts
import * as Vuex from 'vuex';
import todoList from './todoList/index';

// 定义 state 的类型
interface State {
  count: number;
  name: string;
}

// 创建 Vuex store
const store = Vuex.createStore<State>({
  modules: {
    todoList
  },
});

export default store;
