<template>
    <div class="mt-2 mb-2 ml-2 w-1/4 max-w-8 relative inline-block mr-2 align-middle select-none transition duration-200 ease-in">
      <input v-model="toggled" type="checkbox" name="toggle" id="toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-md bg-white border-4 appearance-none cursor-pointer"/>
      <label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-md bg-gray-300 cursor-pointer"></label>
      <!-- <p>{{ toggled }} </p> -->
      <!-- <p>{{ unitUsed }}</p> -->
    </div>
</template>

<script>
    export default {
        data(){
          return {
            toggled: false
          }
        },
        watch: {
          toggled(){
            this.emitToParent()
          }
        },
      methods: {
        emitToParent(){
          console.log(this.toggled)
          this.$emit('changeunit', this.toggled)
        }
      }  
    }
</script>

<style>
.toggle-checkbox:checked {
  right: 0;
  border-color: #688dd3;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #68b1d3;
}
</style>