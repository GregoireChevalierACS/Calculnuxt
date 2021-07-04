<template>
    <div class="flex flex-row bg-blue-100 w-screen h-screen">
        <div class="w-1/3 bg-blue-200 h-screen">
        Page de test
        <!-- <select class="dropdown" v-model="pageFormats">
            <option value="32x45"  ><label>32x45</label></option>
            <option value="36x52"><label>36x52</label></option>
            <option value="36x64"><label>36x64</label></option>
            <option value="36x66"><label>36x66</label></option>
            créer un tableau avec les x options
            rentrer les infos : label, L & l + id sous forme de string option = value
            faire une boucle
            
        </select> -->
        <select v-model="selectedValue" class="m-2 p-2 w-2/3 bg-blue-100 hover:bg-white text-center" placeholder="Choose your format">
            <option v-for="format in formats" :key="format.id" :value="format.id"> {{ format.label }} </option>
        </select>
        <br>
        <!-- <p v-if="selectedFormat"> {{ selectedFormat }} </p> -->
        <span v-if='selectedValue' class="m-2">Format selectionné : {{ selectedFormat.height }} x {{ selectedFormat.width }} </span>
        <p>
            <!-- <label for="value">Height value here →</label> -->
            <input
            v-model="valueH"
            class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
            id="Hvalue"
            type="text"
            placeholder="Height value here"
            value="0"
            > {{unitUsed}}
            <!-- break down en components -->
        </p>
        <p>
            <!-- <label for="value">Width value here →</label> -->
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
                <div class="flex flex-col">
                    <!-- <p v-if='selectedValue' :class="resultFont">{{ selectedFormat.height / valueH}} - {{ selectedFormat.width / valueW}}</p> -->
                    <p v-if='selectedValue'>On peut placer un maximum de {{ landscapeHeightPoses }} poses dans la hauteur au format paysage</p>
                    <p v-if='selectedValue'>On peut placer un maximum de {{ landscapeWidthPoses }} poses dans la largeur au format paysage</p>
                    <p v-if='selectedValue' :class="landscapeResultFont">On peut placer un maximum de {{ landscapeHeightPoses * landscapeWidthPoses }} poses à l'impression au format paysage</p>
                    <!-- <p class="mt-10" v-if='selectedValue' :class="resultFont">{{ selectedFormat.height / valueW }} - {{ selectedFormat.width / valueH}}</p> -->
                    <p v-if='selectedValue'>On peut placer un maximum de {{ portraitHeightPoses }} poses dans la hauteur au format portrait</p>
                    <p v-if='selectedValue'>On peut placer un maximum de {{ portraitWidthPoses }} poses dans la largeur au format portrait</p>
                    <p v-if='selectedValue' :class="portraitResultFont">On peut placer un maximum de {{ portraitHeightPoses * portraitWidthPoses }} poses à l'impression au format portrait</p>
                </div>
                <!-- <p>texte ici</p>
                PAS DE CALCUL DANS LE DOM
                computed
                 -->
            <!-- <p> {{ checked }} </p> -->
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
            landscapeHeightPoses(){ // abrévié LHP
                if (this.mode) {
                    return parseInt((this.selectedFormat.height - this.margin) / ((this.valueH / 10) + (2 * this.bordsPerdus / 10) ) )
                }else{return parseInt((this.selectedFormat.height - this.margin) / (this.valueH + (2 * this.bordsPerdus)))}
            },
            landscapeWidthPoses(){ // abrévié LWP
                if (this.mode) {
                    return parseInt((this.selectedFormat.width - this.margin) / ((this.valueW / 10) + (2 * this.bordsPerdus / 10) ) )
                }else{return parseInt((this.selectedFormat.width) / (this.valueW + (2 * this.bordsPerdus)))}
            },
            portraitHeightPoses(){ // abrévié PHP
                if (this.mode) {
                    return parseInt((this.selectedFormat.width - this.margin) / ((this.valueH / 10) + (2 * this.bordsPerdus / 10) ) )
                }else{return parseInt((this.selectedFormat.width - this.margin) / (this.valueH + (2 * this.bordsPerdus)))}
            },
            portraitWidthPoses(){ // abrévié PWP
                if (this.mode) {
                    return parseInt((this.selectedFormat.height - this.margin) / ((this.valueW / 10) + (2 * this.bordsPerdus / 10) ) )
                }else{return parseInt((this.selectedFormat.height - this.margin) / (this.valueW + (2 * this.bordsPerdus)))}
            },
            calcul(){ // premier test de refacto : 
                if (this.mode) {
                    LHP = parseInt((this.selectedFormat.height - this.margin) / ((this.valueH / 10) + (2 * this.bordsPerdus / 10) ) )
                    LWP = parseInt((this.selectedFormat.width - this.margin) / ((this.valueW / 10) + (2 * this.bordsPerdus / 10) ) )
                    PHP = parseInt((this.selectedFormat.width - this.margin) / ((this.valueH / 10) + (2 * this.bordsPerdus / 10) ) )
                    PWP = parseInt((this.selectedFormat.height - this.margin) / ((this.valueW / 10) + (2 * this.bordsPerdus / 10) ) )
                    return LHP, LWP, PHP, PWP
                }else{
                    LHP = parseInt((this.selectedFormat.height - this.margin) / (this.valueH + (2 * this.bordsPerdus)))
                    LWP = parseInt((this.selectedFormat.width - this.margin) / (this.valueW + (2 * this.bordsPerdus)))
                    PHP = parseInt((this.selectedFormat.width - this.margin) / (this.valueH + (2 * this.bordsPerdus)))
                    PWP = parseInt((this.selectedFormat.height - this.margin) / (this.valueW + (2 * this.bordsPerdus)))
                    return LHP, LWP, PHP, PWP
                }
            }, // 2e test de refacto
            calculH(formH, valH, valW, bordsP, mrgT){
                if(this.mode){
                    valH /= 10
                    valW /= 10
                }
               LHP = parseInt((formH - mrgT) / (valH + (2 * bordsP)))
               PWP = parseInt((formH - mrgT) / (vaW + (2 * bordsP)))
            },
            calculW(formW, valueH, valW, bordsP, mrgT){
                if(this.mode){
                    valH /= 10
                    valW /= 10
                }
               LWP = parseInt((formW - mrgT) / (valW + (2 * bordsP)))
               PHP = parseInt((formW - mrgT) / (vaW + (2 * bordsP)))
            },
            landscapeResultFont(){
                return (this.portraitHeightPoses * this.portraitWidthPoses) 
                < (this.landscapeHeightPoses * this.landscapeWidthPoses) ? 'font-bold' : 'font-normal'
            },
            portraitResultFont(){
                return (this.portraitHeightPoses * this.portraitWidthPoses) 
                > (this.landscapeHeightPoses * this.landscapeWidthPoses) ? 'font-bold' : 'font-normal'
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
                    this.bordsPerdus = parseFloat((this.bordsPerdus * multiplicateur).toFixed(3))
                    this.mode = mode
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>