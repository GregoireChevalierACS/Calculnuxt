<template>
    <div class="flex flex-row bg-blue-100 w-screen h-screen">
        <div class="w-1/3 bg-blue-200 h-screen">
        Page de test
        <select v-model="selectedValue" class="m-2 p-2 w-2/3 bg-blue-100 hover:bg-white text-center" placeholder="Choose your format">
            <option v-for="format in formats" :key="format.id" :value="format.id"> {{ format.label }} </option>
        </select>
        <br>
        <span v-if='selectedValue' class="m-2">Format selectionné : {{ selectedFormat.height }} x {{ selectedFormat.width }} </span>
        <p>
            <input
            v-model="valueH"
            class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
            id="Hvalue"
            type="text"
            placeholder="Height value here"
            value="0"
            > {{unitUsed}}
        </p>
        <p>
            <input
            v-model="valueW"
            class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
            id="Wvalue"
            type="text"
            placeholder="Width value here"
            value="0"
            > {{unitUsed}}
        </p>
        <p>
            <input
            v-model="bordsPerdus"
            class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
            id="bordsPerdus"
            type="text"
            placeholder="Bords perdus value here"
            value="0"
            > {{unitUsed}}
        </p>
        <input v-model="checked" type="checkbox" class="ml-2 checked:bg-blue-600 checked:border-transparent"> Marge Technique
        <the-margin-component :class="marginClass" />
        <!-- <p>Product of both values here : {{ valueH * valueW }}</p> -->
        </div>
        <!-- <toggle-button /> -->
        <div class="flex flex-col min-w-8">
            <div class="mt-10 ml-10">
            <toggle-button @changeunit="changeUnits" />
            <!-- <toggle-button @test="test" /> -->
                <div v-if="selectedValue && 1 == 2" class="flex flex-col">
                    <p>On peut placer un maximum de {{ calculatedPoses.landscape.height }} poses dans la hauteur au format paysage</p>
                    <p>On peut placer un maximum de {{ calculatedPoses.landscape.width }} poses dans la largeur au format paysage</p>
                    <p :class="landscapeResultFont">On peut placer un maximum de {{ calculatedPoses.landscape.total }} poses à l'impression au format paysage</p>
                    <!-- <p class="mt-10" :class="resultFont">{{ selectedFormat.height / valueW }} - {{ selectedFormat.width / valueH}}</p> -->
                    <p>On peut placer un maximum de {{ calculatedPoses.portrait.height }} poses dans la hauteur au format portrait</p>
                    <p>On peut placer un maximum de {{ calculatedPoses.portrait.width }} poses dans la largeur au format portrait</p>
                    <p :class="portraitResultFont">On peut placer un maximum de {{ calculatedPoses.portrait.total }} poses à l'impression au format portrait</p>
                </div>
                <!-- Another loop idea -->
                <div v-if="selectedValue" class="flex flex-col w-96">
                    <div v-for="key in Object.keys(calculatedPoses)" :key="key" class="bg-white rounded-lg my-4 p-4 shadow-md">
                        <p class="font-bold text-2xl uppercase mb-2">{{ key }}</p>
                        <div v-for="item in Object.keys(calculatedPoses[key])" :key="item" class="flex items-center justify-between w-full mb-2">
                            <p class="text-gray-600 font-medium">{{ item }}</p>
                            <p class="font-bold">{{ calculatedPoses[key][item] }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                valueH: '',
                valueW: '',
                bordsPerdus: '',
                selectedValue: '',
                mode: false,
                checked: '',
                formats: [
                    {
                        id: '1',
                        label: '32x45',
                        width: 45,
                        height: 32
                    },
                    {
                        id: '2',
                        label: '36x52',
                        width: 52,
                        height: 36
                    },
                    {
                        id: '3',
                        label: '36x64',
                        width: 64,
                        height: 36
                    },
                    {
                        id: '4',
                        label: '36x66',
                        width: 66,
                        height: 36
                    }
                ]
            }
        },
        computed: {
            selectedFormat(){
                return this.formats.find(item => item.id === this.selectedValue)
            },
            unitUsed(){
                return this.mode ? 'mm' : 'cm'
            },
            // Get all calculated poses to display in-app
            calculatedPoses(){
                const divider = this.mode ? 10 : 1
                const landscape = {
                    height: this.spaceCalculation(this.selectedFormat.height, this.valueH / divider, this.margin, this.bordsPerdus / divider),
                    width: this.spaceCalculation(this.selectedFormat.width, this.valueW / divider, this.margin, this.bordsPerdus / divider),
                }
                const portrait = {
                        height: this.spaceCalculation(this.selectedFormat.width, this.valueH / divider, this.margin, this.bordsPerdus / divider),
                        width: this.spaceCalculation(this.selectedFormat.height, this.valueW / divider, this.margin, this.bordsPerdus / divider),
                    }
                return {
                    landscape: {
                        ...landscape,
                        total: landscape.height * landscape.width
                    },
                    portrait: {
                        ...portrait,
                        total: portrait.height * portrait.width
                    }
                }
            },
            landscapeResultFont(){
                return this.calculatedPoses.portrait.total < this.calculatedPoses.landscape.total ? 'font-bold' : 'font-normal'
            },
            portraitResultFont(){
                return this.calculatedPoses.portrait.total > this.calculatedPoses.landscape.total ? 'font-bold' : 'font-normal'
            },
            marginClass(){
                return this.checked ? 'flex' : 'hidden'
            },
            margin(){
                return this.checked ? 1 : 0
            }
        },
        methods: {
            changeUnits(mode){
                 if(mode !== this.mode) {
                    const multiplicateur = mode ? 10 : 0.1 
                    this.valueW = parseFloat((this.valueW * multiplicateur).toFixed(3))
                    this.valueH = parseFloat((this.valueH * multiplicateur).toFixed(3))
                    this.bordsPerdus = parseFloat((this.bordsPerdus * multiplicateur).toFixed(3)) // modifier le child?
                    this.mode = mode
                }
            },
            // Calculate space
            spaceCalculation(format, value, margin, bleed) {
                return parseInt((format - margin) / (value + (2 * bleed / 10))) || 0
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>