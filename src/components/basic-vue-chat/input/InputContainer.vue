<template>
  <div class="input__container">
    <img
      v-show="file && !uploadedSuccessfully"
      src="https://wizard-chatbot-widget.s3-us-west-2.amazonaws.com/dist/img/pdf.png"
      class="image--uploaded" >
    <img
      v-show="file && uploadedSuccessfully"
      src="https://wizard-chatbot-widget.s3-us-west-2.amazonaws.com/dist/img/pdf-success.png"
      class="image--uploaded" >
    <slot name="input-field">
      <input-field
        v-model="message"
        @newOwnMessage="onNewOwnMessage" />
    </slot>
    <div class="features__container">
      <div class="input-get-prefixed">
        <label for="ideas">
          <font-awesome-icon
            class="bulbIcon"
            icon="lightbulb"
            @click="toggleFloatings" />
        </label>
      </div>
      <div class="input-images-upload">
        <input
          id="image"
          ref="image"
          type="file"
          class="image"
          accept=".pdf"
          @change="handleFileUpload()"
        >
        <label for="image">
          <font-awesome-icon icon="paperclip" />
        </label>
      </div>

      <slot name="features" />
    </div>
    <slot name="input-button">
      <input-button @newOwnMessage="onNewOwnMessage" />
    </slot>
  </div>
</template>

<script>
import InputField from './InputField.vue'
import InputButton from './InputButton.vue'
import S3 from 'aws-s3'
import EventBus from '@/event-bus'

export default {
  name: 'InputContainer',
  components: {
    InputField,
    InputButton
  },
  props: {},
  data: function () {
    return {
      message: '',
      file: undefined,
      imagePreview: '',
      opened: false,
      uploadedSuccessfully: false
    }
  },
  methods: {
    onNewOwnMessage () {
      if ((!this.message || this.message === '') && !this.file) {
        return
      }

      this.$emit('newOwnMessage', this.message, this.file, this.imagePreview)

      this.message = ''

      this.file = undefined

      this.imagePreview = ''
    },
    toggleFloatings () {
      this.opened = !this.opened
      EventBus.$emit('optionsToggled', this.opened)
    },

    imageS3Uploader (file) {
      console.log('insideUplaode')
      const config = {
        bucketName: 'getimagetextbuck',
        // dirName: "main",
        region: 'us-east-1',
        accessKeyId: '',
        secretAccessKey: '',
        s3Url: 'https://' /* optional */
        // header: "Access-Control-Allow-Origin: *",
      }

      const S3Client = new S3(config)
      /*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

      let newFileName = 'contractSample'

      S3Client.uploadFile(file, newFileName)
        .then(data => {
          console.log(data)
          this.uploadedSuccessfully = true
        })
        .catch(err => console.error(err))

      /**
       * {
       *   Response: {
       *     bucket: "your-bucket-name",
       *     key: "photos/image.jpg",
       *     location: "https://your-bucket.s3.amazonaws.com/photos/image.jpg"
       *   }
       * }
       */
    },
    handleFileUpload () {
      this.file = this.$refs.image.files[0]
      this.imageS3Uploader(this.file)
      let reader = new FileReader()

      reader.addEventListener(
        'load',
        function () {
          this.imagePreview = reader.result
        }.bind(this),
        false
      )

      if (this.file) {
        if (/\.(jpe?g|png|gif)$/i.test(this.file.name)) {
          reader.readAsDataURL(this.file)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.visible {
  display: none;
}

.floatings {
  position: fixed;
  bottom: 7rem;
  right: 4rem;
}

.floatings__button {
  // display: block;
  // position: absolute;
  border-radius: 7px;
  padding: 5px;
  margin: 5px;
  background-color: #026cb6;
  color: #f8f9fa;
  border-left: 10px solid #5c5c5c;
  text-align: center;
  line-height: 1rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
  border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
  top 0.15s ease-in-out, margin-top 0.15s ease-in-out;
}

.floatings__button:hover {
  background-color: #0287e4;
  border-left: 10px solid #0287e4;
}

.bulbIcon {
  color: #026cb6;
  margin-right: 7px;
}

.bulbIcon:hover, .bulbIcon:active {
  color: #0287e4;
  margin-right: 7px;
}
</style>
