<template>
  <div class="chat-container">
    <ul>
      <li v-for="(message, i) in chat" :key="i">
        <Name :name="message.name" :icon="message.icon" />
        <span class="channel-name" v-if="message.channel != null">{{ message.channel }}</span>
        <span class="channel-message">: {{ message.message }}</span>
      </li>
    </ul>
    <div class="chat-input">
      <ChatInput @sentMessage="sentMessage" @requestHelp="requestHelp" />
    </div>
  </div>
</template>

<script>
import Name from "@/components/chat/Name";
import ChatInput from "@/components/chat/ChatInput";

export default {
  components: {
    Name,
    ChatInput
  },
  watch: {
    chat: function(_chat) {
      if (_chat.length > 30) {
        this.chat = _chat
          .reverse()
          .splice(0, 30)
          .reverse();
      }
    }
  },
  methods: {
    sentMessage: function(message) {
      this.chat.push({
        name: "pepega",
        icon: null,
        message: message,
        channel: "avicii"
      });
    },
    requestHelp: function() {

    }
  },
  data() {
    return {
      chat: [
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        },
        {
          name: "KasperRT",
          icon: "https://img.youtube.com/vi/fn_amMJehPU/mqdefault.jpg",
          message: "Hei på deg",
          channel: "summér"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  padding: 0;

  & li {
    display: flex;
    color: white;

    & .channel-name {
      font-size: 0.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: whitesmoke;
    }

    &:nth-child(even) {
      background: #00000040;
    }

    &:nth-child(odd) {
      background: #00000050;
    }
  }
}
</style>