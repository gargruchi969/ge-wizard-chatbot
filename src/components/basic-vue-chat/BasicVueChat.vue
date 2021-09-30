<template>
  <div class="basic-vue-chat chat-display">
    <section class="window">
      <header class="window__header__container">
        <slot name="header">{{ title }}</slot>
        <button
          class="closeButton"
          @click="closeChat">X</button>
      </header>
      <section
        id="window__messages__container"
        class="window__messages__container">
        <slot>
          <messages-list
            :feed="feed"
            :author-id="authorId"
            class="messages-list" />
          <beat-loader
            :loading="loading"
            :size="10"
            class="beat-loader-class"
            color="#0287e4"/>
        </slot>
        <slot v-if="showOptions">
          <input-options :bot-name="botName"/>
        </slot>
      </section>
      <div class="window__input__container">
        <slot name="input-container">
          <input-container @newOwnMessage="onNewOwnMessage" />
        </slot>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import { scrollToBottom } from '../../helpers/scroll.js'
import MessagesList from './messages/MessagesList.vue'
import InputContainer from './input/InputContainer.vue'
import InputOptions from './input/InputOptions.vue'
import axios from 'axios'
import aws4 from 'aws4-tiny'
import AWS from 'aws-sdk'
import EventBus from '@/event-bus'

export default {
  name: 'BasicVueChat',
  components: {
    MessagesList,
    InputContainer,
    InputOptions
  },
  props: {
    title: {
      type: String,
      default: 'GE Wizard',
      required: false
    },
    initialAuthorId: {
      type: Number,
      default: 0,
      required: false
    },
    attachMock: {
      type: Boolean,
      default: false,
      required: false
    },
    initialFeed: {
      type: Array,
      default: function () {
        return []
      },
      required: false
    },
    newMessage: {
      type: Object,
      default: function () {
        return {}
      },
      required: false
    }
  },
  data () {
    return {
      feed: [],
      authorId: 0,
      botName: '',
      alias: '',
      loading: false,
      showOptions: false
    }
  },
  watch: {
    newMessage: function (newValue, oldValue) {
      this.pushToFeed(newValue)
      scrollToBottom()
    }
  },
  mounted () {
    let here = this
    EventBus.$on('optionsToggled', function (value) {
      here.showOptions = value
    })

    EventBus.$on('selectedOptions', function (value) {
      here.onNewOwnMessage(value, '', '')
    })

    this.getIntentValue()
    console.log('at mount', this.botName, this.alias)
    if (this.attachMock) {
      import('./mocks/mock-messages-list.js')
        .then(mockData => {
          this.feed = mockData.default.feed
          this.setAuthorId(mockData.default.authorId)
        })
        .catch(error => {
          console.error('Failed to load mock data from file. ', error)
        })
    } else {
      this.feed = this.initialFeed
      this.authorId = this.initialAuthorId
    }
  },
  methods: {
    closeChat () {
      this.$emit('closeChatWindow')
    },

    getIntentValue () {
      axios
        .get(
          'https://dz8ojj03s4.execute-api.us-west-2.amazonaws.com/dev/intent'
        )
        .then(response => {
          this.botName = response.data.body.botName
          this.alias = response.data.body.alias
        })
        .catch(function (error) {
          console.log(error)
        })
    },

    awsPostReq (element, botName, alias) {
      var credentials = {
        accessKeyId: '',
        secretAccessKey: '',
        sessionToken: '' // only required for temporary credentials
      }
      let here = this
      var request = aws4.sign(
        {
          service: 'lex',
          region: 'us-west-2',
          host: 'runtime.lex.us-west-2.amazonaws.com',
          path: `bot/${botName}/alias/${alias}/user/121/text`,
          method: 'POST',
          hostname: 'runtime.lex.us-west-2.amazonaws.com',
          body: `{ "inputText": "${element.contents}" }`,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        credentials
      )

      fetch(
        `https://runtime.lex.us-west-2.amazonaws.com/bot/${botName}/alias/${alias}/user/121/text`,
        request
      ).then(function (response) {
        // Examine the text in the response
        response.json().then(function (data) {
          console.log(data.message)
          here.loading = false
          here.feed.push({
            id: 1,
            author: '',
            contents: data.message,
            date: moment().format('HH:mm:ss')
          })
          scrollToBottom()
        })
      })
    },

    pushToFeed (element) {
      this.feed.push(element)
      this.awsPostReq(element, this.botName, this.alias)
      this.loading = true
    },
    onNewOwnMessage (message, image, imageUrl) {
      if (typeof image !== 'undefined') {
        imageUrl = image.name
        console.log(image)
      }
      const newOwnMessage = {
        id: this.authorId,
        contents: message,
        image: image,
        imageUrl: imageUrl,
        date: moment().format('HH:mm:ss')
      }

      this.pushToFeed(newOwnMessage)

      scrollToBottom()

      this.$emit('newOwnMessage', message)
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/main.scss";
.beat-loader-class {
  text-align: left !important;
  margin: 10px;
}

.closeButton {
  color: white;
  background: none;
  border: none;
  position: fixed;
  right: 60px;
}

.chat-display {
  width: 325px;
}
</style>
