<template>
  <div class="layout">
    <Layout>
      <Content>
        <h1 class="title">
          todos
          <!-- <SendNotification /> -->
        </h1>
        <Input
          class="row-input"
          placeholder="Enter content"
          v-model="value"
          autofocus
          @keyup.enter.native="handleAddClick"
        >
          <Icon
            type="md-add-circle"
            slot="prefix"
            size="36"
            @click="handleAddClick"
          />
        </Input>
        <List size="large">
          <template v-for="item in todos">
            <template v-if="filter === 'All' || filter === item.completed">
              <ListItem v-bind:key="item.id">
                <div>
                  <Icon
                    class="update-complete-state"
                    v-if="item.completed"
                    type="ios-checkmark-circle"
                    color="#42b983"
                    @click="handleChangeCompleted(item.id)"
                  />
                  <Icon
                    class="update-complete-state"
                    v-else
                    type="ios-checkmark-circle"
                    @click="handleChangeCompleted(item.id)"
                  />
                  <span :class="item.completed ? 'uncompleted' : ''">{{
                    item.id + "-" + item.text
                  }}</span>
                </div>
                <Icon
                  type="md-close"
                  @click="handleCloseClick(item.id, $event)"
                />
              </ListItem>
            </template>
          </template>

          <ListItem class="state-item">
            <div>{{ unCompletedItemCount }} items left</div>
            <div class="state-link">
              <a
                :class="filter === 'All' ? 'active' : ''"
                @click="handleFilterClick('All')"
                >All</a
              >
              <a
                :class="filter !== 'All' && !filter ? 'active' : ''"
                @click="handleFilterClick(false)"
                >Active</a
              >
              <a
                :class="filter !== 'All' && filter ? 'active' : ''"
                @click="handleFilterClick(true)"
                >Completed</a
              >
            </div>
            <a @click="handleClearCompleted">Clear Completed</a>
          </ListItem>
        </List>
      </Content>
    </Layout>
  </div>
</template>

<script>
import {
  Layout,
  Button,
  Row,
  Col,
  Input,
  Form,
  FormItem,
  Icon,
  List
} from "view-design";
import SendNotification from "./SendNotification.vue";
import { mapState, mapGetters, mapActions } from "vuex";
import config from "./config.js";
import tools from "./tools.js";

export default {
  name: "App",
  components: {
    Layout,
    Button,
    Row,
    Col,
    Form,
    FormItem,
    Icon,
    Input,
    List,
    ListItem: List.Item,
    SendNotification
  },
  data: function() {
    return {
      value: "",
      filter: "All"
    };
  },
  computed: {
    ...mapState(["todos", "currentId"]), // map this.todos to this.$store.state.todos
    ...mapGetters(["unCompletedItemCount"])
  },
  methods: {
    ...mapActions([
      "addTodo",
      "removeTodo",
      "changeCompleted",
      "clearCompleted"
    ]), // map this.addTodo() to this.$store.dispatch(...)
    handleAddClick() {
      // this.$store.dispatch({ type: "addTodo", item });
      this.addTodo({
        type: "addTodo",
        item: {
          text: this.value,
          completed: false
        }
      });
      this.value = "";
    },
    handleCloseClick(id, ev) {
      this.removeTodo({
        type: "removeTodo",
        id
      });
    },
    handleChangeCompleted(id) {
      this.changeCompleted({
        type: "changeCompleted",
        id
      });
    },
    handleFilterClick(filter) {
      this.filter = filter;
    },
    handleClearCompleted() {
      this.clearCompleted("clearCompleted");
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
body {
  display: flex;
  justify-content: center;
}
body,
.title {
  /* background-color: #add5a2 !important; */
}
.layout {
  width: 550px;
  margin-top: 100px;
  align-items: center;
  padding: 0 5px;
}
.layout content {
  text-align: center;
}

.title {
  font-size: 64px;
}
.row-input input {
  width: 100%;
  height: 67px;
  border-radius: 0;
  padding: 16px 16px 16px 76px;
  font-size: 24px;
}
.ivu-icon-md-add-circle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.ivu-list-large .ivu-list-item {
  padding: 16px;
  font-size: 24px;
  border-color: gray;
}
.ivu-icon-md-close {
  position: absolute;
  right: 16px;
  cursor: pointer;
}
.ivu-icon-md-close:before {
  color: rgba(192, 52, 29, 0.9);
  position: relative;
  top: 2px;
}

.state-item {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 14px !important;
}
.ivu-list-item-extra {
  display: none;
}
.state-link a:not(:last-child) {
  margin-right: 5px;
}
.active,
.state-link a:hover {
  border-bottom: 1px solid #2d8cf0;
}
.update-complete-state {
  cursor: pointer;
}
.uncompleted {
  text-decoration: line-through;
  color: lightgray;
}
</style>
