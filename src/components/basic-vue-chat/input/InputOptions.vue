<template>
  <div class="info">
    <div
      v-for="(value, index) in options"
      :key="index"
      class="options-container">
      <button
        class="options"
        @click="optionClicked(value)">{{ value }}</button>
    </div>
  </div>
</template>

<script>
import EventBus from '@/event-bus'

export default {
  props: ['botName'],
  data () {
    return {
      options: null
    }
  },
  mounted () {
    this.assignOptions()
  },
  methods: {
    assignOptions () {
      if (this.botName == 'wizard') {
        this.options = ['Verify my invoice', 'Validate Invoice']
      } else if (this.botName == 'ScheduleAppointment') {
        this.options = ['Book an Appointment']
      } else if (this.botName == 'puneMMF') {
        this.options = ['Availability', 'Part Details', 'Order Status']
      }
    },
    optionClicked (value) {
      console.log(value)
      EventBus.$emit('selectedOptions', value)
      EventBus.$emit('optionsToggled', false)
    }
  }
}
</script>

<style scoped>
.options {
  color: #0287e4 !important;
  background-color: white !important;
  border: 1px solid #0287e4;
  border-radius: 5px;
  margin-left: 15px;
  padding: 4px;
  font-size: 13px;
}

.options:hover {
  color: white !important;
  background-color: #0287e4 !important;
  font-size: 14px;
}

.options-container {
  margin-top: 2% !important;
  margin-bottom: none !important;
  float: left;
}

.info {
  height: 160px;
  position: fixed;
  bottom: 0%;
  width: 100%;
  opacity: 1;
}
</style>
