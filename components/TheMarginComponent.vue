<template>
    <div class="mt-2">
         <p class="ml-2"> Marge Technique </p>
        <input
            v-model="storeMargin"
            class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-gray-300"
            id="margin"
            type="text"
            placeholder="1"
            value="1"
            >
    </div>
</template>

<script>
    export default {
        computed: {
            storeMargin: {
                get(){
                    return this.$store.getters.getterMarginValue
                },
                set(value){
                    this.$store.commit('setMarginValue', value)
                }
            }
        }
        // watch: {
        //   margin(){
        //     this.emitToParent()
        //   }
        // },
        // methods: {
        //     emitToParent(){
        //     this.$emit('margin', this.margin)
        //     }
        // }
    }
</script>

<style lang="scss" scoped>

</style>