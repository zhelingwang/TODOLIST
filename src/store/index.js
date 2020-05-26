import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

export default new Vuex.Store({

    state: {
        todos: [{
            id: 0,
            text: 'hello there',
            completed: false
        }],
        currentId: 0
    },
    // derived propss
    getters: {
        unCompletedItemCount: state => state.todos.filter(item => !item.completed).length
    },
    // must be sync
    mutations: {
        // payload:{ type:'addTodo',item:... }
        addTodo(state, payload) {
            state.todos.push({
                id: ++state.currentId,
                ...payload.item
            });
        },
        removeTodo(state, payload) {
            let idx;
            for (let i = 0, l = state.todos.length; i < l; i++) {
                if (payload.id === state.todos[i].id) {
                    idx = i;
                    break;
                }
            }
            if (idx !== void 0 && state.todos.length > 0) state.todos.splice(idx, 1);
        },
        changeCompleted(state, payload) {
            for (let i = 0, l = state.todos.length; i < l; i++) {
                if (payload.id === state.todos[i].id) {
                    state.todos[i].completed = !state.todos[i].completed;
                    break;
                }
            }
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(item => !item.completed)
        }
    },
    // can be async , {commit,dispatch} = context[this.$store]
    // usage 1 : context.commit[dispath]('typeName',data)
    // usage 2 : context.commit[dispath]({ type:'typeName',data })
    // type and data all in payload 
    actions: {
        addTodo({ commit }, item) {
            // can do any async operation
            commit('addTodo', item)
            // or commit({type:'addTodo',item})
        },
        removeTodo({ commit }, id) {
            commit('removeTodo', id);
        },
        changeCompleted({ commit }, id) {
            commit('changeCompleted', id)
        },
        clearCompleted({ commit }) {
            commit('clearCompleted')
        }
    }

});