<template>
    <div class="chat-input">
        <input v-model="chatInput" type="text" placeholder="Aa.." @keyup.enter="send" />
        <button @click="send">Send</button>
        <button @click="requestHelp">Help</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            chatInput: ""
        }
    },
    methods: {
        send: function() {
            if(this.chatInput == "") {
                return;
            }
            this.$emit("sentMessage", this.chatInput);
            this.chatInput = "";
        },
        requestHelp: function() {
            console.log("emit for help here");
        }
    }
}
</script>

<style scoped lang="scss">

</style>