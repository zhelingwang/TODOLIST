<template>
  <Button type="primary" @click="handleClick">Send Notice</Button>
</template>

<script>
import { Button } from "view-design";
import tools from "./tools.js";

export default {
  data: function() {
    return {};
  },
  components: {
    Button
  },
  methods: {
    handleClick() {
      const payload = "test payload..." + Math.random();
      tools.notifyServerSendNotification({
        text: payload,
        type: "ADD"
      });
    }
  }
};
</script>

<style lang="stylus"></style>
