<template>
    <div class=" w-full flex flex-col">
        <p class="ml-2"> Fonds Perdus </p>
        <input
        v-model="storeBleeding"
        class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
        id="bordsPerdus"
        type="text"
        placeholder="Bords perdus value here"
        value="0"
        > <!-- {{unitUsed}} -->
    </div>
</template>

<script>
    export default {
        computed: {
            storeBleeding: {
                get(){
                    return this.$store.getters.getterBleedingValue
                },
                set(value){
                    this.$store.commit('setBleedingValue', value)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>