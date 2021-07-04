<template>
    <div class="bg-blue-100 w-screen flex flex-col">
        <div class="h-screen">
            <div class="bg-gray-900 h-10 w-screen">
                <p class="ml-5 pt-2 font-mono font-bold text-gray-100">Application de calcul de poses</p>
            </div>
            <div class="bg-yellow-100 h-5/6 flex flex-row ">
    
                <div class="w-1/3 bg-blue-200 flex flex-col">
                    <div class="w-full h-screen flex flex-col justify-evenly">
                    <div>
                        <p class="ml-2 font-bold">Format de feuille de tirage</p>
                        <toggle-button @changeunit="changeUnits" />
                        <the-selector @selectvalue="selectValue($event)" /> 
                        <!-- $event = contenu de l'emit (voir dans outil vue nav) -->
                        <!-- <the-selector @selectvalue="selectedValue=$event" /> -->
                        <input
                            v-model="valueH"
                            class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
                            id="Hvalue"
                            type="text"
                            placeholder="Height value here"
                            value="0"
                            @change="drawRect"
                        > {{unitUsed}}
                        <input
                            v-model="valueW"
                            class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
                            id="Wvalue"
                            type="text"
                            placeholder="Width value here"
                            value="0"
                            @change="drawRect"
                        > {{unitUsed}}
                    </div>
                        <div class="ml-2">
                            <label for="suppOptions">Options supplémentaires</label>
                            <input v-model="menuCheck" type="checkbox" class="ml-2 checked:bg-blue-600 checked:border-transparent">
                        </div>
                        <div :class="displayableMenu">
                            <the-fond-perdu @change="drawRect" /> {{ storeBleeding }} {{ unitUsed }}
                            <the-margin-component @change="drawRect" @margin="margin=$event" /> {{ unitUsed }}
                            {{storeMargin}}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col w-1/3">
                    <div class="mt-10 ml-10">
                        <div class="flex flex-col w-5/6">
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
                <div class="flex flex-col w-1/3 h-5/6">
                    <div class="mt-10 ml-10 bg-green-200 h-5/6">
                        <div class="flex flex-col w-5/6">
                            <canvas :style="canvasStyle" class="border-2 border-black" id="c"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        data(){
            return {
                valueH: 0,
                valueW: 0,
                bleeding: 0,
                margin: 0,
                menuCheck: true,
                mode: false,
                selectedValue: '',
                vueCanvas: null,
                rectWidth: 100
            }
        },
        computed: {
            ...mapGetters({
                storeMargin: 'getterMarginValue',
                storeBleeding: 'getterBleedingValue'
            }),
            canvasStyle(){
                return 'height! ' + ((this.selectedValue.height * 3) || 0) + 'px; width: ' + ((this.selectedValue.width * 3) || 0) + 'px;'
            },
            displayableMenu(){
                return this.menuCheck ? '' : 'hidden'
            },
            unitUsed(){
                return this.mode ? 'mm' : 'cm'
            },
            calculatedPoses(){
                const divider = this.mode ? 10 : 1
                const landscape = {
                    height: this.spaceCalculation(this.selectedValue.height, this.valueH / divider, this.storeMargin, this.storeBleeding / divider),
                    width: this.spaceCalculation(this.selectedValue.width, this.valueW / divider, this.storeMargin, this.storeBleeding / divider),
                }
                const portrait = {
                        height: this.spaceCalculation(this.selectedValue.width, this.valueH / divider, this.storeMargin, this.storeBleeding / divider),
                        width: this.spaceCalculation(this.selectedValue.height, this.valueW / divider, this.storeMargin, this.storeBleeding / divider),
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
            }
        },
        methods: {
            changeUnits(mode){
                 if(mode !== this.mode) {
                    const multiplicateur = mode ? 10 : 0.1 
                    this.valueW = parseFloat((this.valueW * multiplicateur).toFixed(3))
                    this.valueH = parseFloat((this.valueH * multiplicateur).toFixed(3))
                    this.storeBleeding = parseFloat((this.storeBleeding * multiplicateur).toFixed(3)) // modifier la value du vmodel child?
                    this.storeMargin = parseFloat((this.storeMargin * multiplicateur).toFixed(3)) // modifier la value du vmodel child?
                    this.mode = mode
                }
            },
            selectValue(event){
                this.selectedValue = event
                this.drawRect()
            },
            spaceCalculation(format, value, storeMargin, storeBleeding) {
                return parseInt((format - (storeMargin)) / (value + (2 * (storeBleeding)))) || 0
            },
            testRect(loopNumber){
                if (loopNumber < 1) {
                    this.vueCanvas.rect(((this.storeMargin + this.storeBleeding) * 3 + (loopNumber * this.valueW)), 
                    (this.storeMargin + this.storeBleeding) * 3, 
                    (this.valueW * 3), (this.valueH * 3));
                }
            },
            drawRect() {
                console.log("drawRect appelée");
                // récupérer la variable "total" via store
                // prendre en compte l'orientation
                // définir une variable offsetW & offsetH
                // faire une boucle sur la valeur de "total" et draw un nouveau rect à chaque 2*bleeding 
                //          à droite du précédent sur une ligne de docW/valueW puis passer à la ligne
                // calculer en direct le breakpoint et update les offsets en fonction. Appeler ensuite le drawrect
                this.vueCanvas.clearRect(0, 0, 1000, 1000);
                var totalLandscape = this.calculatedPoses.landscape.total
                var landscape = this.calculatedPoses.landscape
                var totalPortrait = this.calculatedPoses.portrait.total
                var highestSideValue = 0
                var numberOfPoses = 0
                if (totalLandscape >= totalPortrait) {
                    numberOfPoses = totalLandscape
                    if (landscape.width < landscape.height) {
                        highestSideValue = this.calculatedPoses.landscape.width
                        console.log("value " + highestSideValue)
                    }
                } else {
                    numberOfPoses = totalPortrait
                }
                // this.vueCanvas.beginPath();
                for (let i = 0; i < numberOfPoses; i++) {
                    console.log(i)
                    this.testRect(i);
                    this.vueCanvas.stroke(); 
                    // this.vueCanvas.rect((this.storeMargin + this.storeBleeding) * 3, 
                    //                     (this.storeMargin + this.storeBleeding) * 3, 
                    //                     (this.valueW * 3), (this.valueH * 3));
                }
                     
            }
        },
        mounted() {
            var c = document.getElementById("c");
            var ctx = c.getContext("2d");    
            this.vueCanvas = ctx;
        }
    }
</script>

<style lang="scss" scoped>

</style>