<template>
  <div>
    <div>{{msg}}</div>
    <Button @click="handleClick">button</Button>
  </div>
</template>

<script>
import { Button } from "view-design";

export default {
  name: "App",
  components: {
    Button
  },
  data: function() {
    return {
      msg: "message from data"
    };
  },
  methods: {
    handleClick() {
      console.log("clicked!");
    }
  }
};
</script>

<style>
div {
  padding: 10px;
}
</style>
