import * as Vuex from 'vuex';

type priority = 1 | 2 | 3 | 4 | 5;

export interface ITask {
    id: string;
    name: string;
    describe: string;
    completed: boolean;
    priority: priority
}

export type ITaskList = ITask[];

export interface ITaskState {
    tasks: ITaskList;
}

const taskListModule: Vuex.Module<ITaskState, any> = {
    namespaced: true,  // 开启命名空间
    state: {
      tasks: [
        { id: '1', name: 'Task 1', describe: 'Task 1 description', completed: false, priority: 1 },
        { id: '2', name: 'Task 2', describe: 'Task 2 description', completed: true, priority: 2 },
        { id: '3', name: 'Task 3', describe: 'Task 3 description', completed: false, priority: 3 },
      ]
    },
    mutations: {
      addTask(state, task: ITask) {
        state.tasks.push(task);
      },
      toggleTask(state, taskId: string) {
        const task = state.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = !task.completed;
        }
      },
      setTasks(state, tasks: ITaskList) {
        state.tasks = tasks;
      }
    },
    actions: {
      addTask({ commit }, task: ITaskList) {
        commit('addTask', task);
      },
      toggleTask({ commit }, taskId: string) {
        commit('toggleTask', taskId);
      },
      setTasks({ commit }, tasks: ITaskList[]) {
        commit('setTasks', tasks);
      }
    },
    getters: {
      completedTasks(state): ITaskList {
        return state.tasks.filter(task => task.completed);
      },
      pendingTasks(state): ITaskList {
        return state.tasks.filter(task => !task.completed);
      }
    }
  };
  
  export default taskListModule;

