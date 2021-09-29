<template>
  <div id="app">
    <basic-vue-chat
      v-show="isOpen"
      :new-message="message"
      class="chatBox"
      @closeChatWindow="toggleChatBox()"
    />
    <div v-show="!isOpen" class="fab" @click="toggleChatBox">
      <img src="https://wizard-chatbot-widget.s3-us-west-2.amazonaws.com/dist/img/chat-logo.png" width="100%" />
    </div>
  </div>
</template>

<script>
import BasicVueChat from "./components/basic-vue-chat/BasicVueChat.vue";

export default {
  name: "App",
  components: {
    BasicVueChat
  },
  data: function() {
    return {
      message: {},
      isOpen: false
    };
  },
  methods: {
    toggleChatBox() {
      console.log("toggleChat");
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style lang="scss">
.fab {
  width: 70px;
  height: 70px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 6px 10px 0 #666;
  font-size: 50px;
  line-height: 70px;
  color: white;
  text-align: center;
  position: fixed;
  right: 50px;
  bottom: 50px;
  transition: all 0.1s ease-in-out;
}

.fab:hover {
  box-shadow: 0 6px 14px 0 #666;
  transform: scale(1.05);
}

.chatBox {
  position: fixed;
  z-index: 999 important;
  right: 50px;
  bottom: 50px;
}
</style>
