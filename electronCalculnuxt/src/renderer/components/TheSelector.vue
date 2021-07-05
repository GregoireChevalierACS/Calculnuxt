<template>
  <div>
    <select v-model="selectedValue" class="m-2 p-2 w-2/3 rounded-sm bg-blue-100 hover:bg-white text-center"
            placeholder="Choose your format"
    >
      <option v-for="format in formats" :key="format.id" :value="format.id">
        {{ format.height }} x {{ format.width }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'TheSelector',
  data () {
    return {
      selectedValue: '',
      formats: [
        {
          id: '0',
          label: '32x45',
          width: 45,
          height: 32
        },
        {
          id: '1',
          label: '36x52',
          width: 52,
          height: 36
        },
        {
          id: '2',
          label: '36x64',
          width: 64,
          height: 36
        },
        {
          id: '3',
          label: '36x66',
          width: 66,
          height: 36
        }
      ]
    }
  },
  watch: {
    selectedValue () {
      this.emitToParent()
    }
  },
  methods: {
    emitToParent () {
      // console.log(this.selectedValue)
      this.$emit('selectvalue', this.formats[this.selectedValue])
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
