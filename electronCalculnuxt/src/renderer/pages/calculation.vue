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
              <p ref="selecteur" class="ml-2 font-bold">Format de feuille de tirage</p>
              <toggle-button @changeunit="changeUnits" />
              <the-selector @selectvalue="selectValue($event)" />
              <!-- $event = contenu de l'emit (voir dans outil vue nav) -->
              <!-- <the-selector @selectvalue="selectedValue=$event" /> -->
              <input
                id="Hvalue"
                v-model="valueH"
                class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
                type="text"
                placeholder="Height value here"
                value="0"
                @change="drawRect"
              > {{ unitUsed }}
              <input
                id="Wvalue"
                v-model="valueW"
                class="m-2 p-2 w-2/3 rounded-sm shadow-inner shadow-lg bg-blue-100 hover:bg-white"
                type="text"
                placeholder="Width value here"
                value="0"
                @change="drawRect"
              > {{ unitUsed }}
            </div>
            <div class="ml-2">
              <label for="suppOptions">Options supplémentaires</label>
              <input v-model="menuCheck" type="checkbox" class="ml-2 checked:bg-blue-600 checked:border-transparent">
            </div>
            <div :class="displayableMenu">
              <!-- <the-fond-perdu @change="drawRect" /> {{ storeBleeding }} {{ unitUsed }}
              <the-margin-component @change="drawRect" @margin="margin=$event" /> {{ unitUsed }}
              {{ storeMargin }} -->
            </div>
          </div>
        </div>
        <div class="flex flex-col w-1/3">
          <div class="mt-10 ml-10">
            <div class="flex flex-col w-5/6">
              <div v-for="key in Object.keys(calculatedPoses)" :key="key"
                   class="bg-white rounded-lg my-4 p-4 shadow-md"
              >
                <p class="font-bold text-2xl uppercase mb-2">{{ key }}</p>
                <div v-for="item in Object.keys(calculatedPoses[key])" :key="item"
                     class="flex items-center justify-between w-full mb-2"
                >
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
              <canvas ref="c" :style="canvasStyle" class="border-2 border-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from '@/store/index.js'
// import { mapGetters } from 'vuex'
import TheSelector from '@/components/TheSelector'
import ToggleButton from '@/components/ToggleButton'
import TheFondPerdu from '@/components/TheFondPerdu'
import TheMarginComponent from '@/components/TheMarginComponent'

export default {
  components: { TheSelector, ToggleButton, TheFondPerdu, TheMarginComponent },
  data () {
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
    // ...mapGetters({
    //   storeMargin: 'getterMarginValue',
    //   storeBleeding: 'getterBleedingValue'
    // }),
    canvasStyle () {
      // alert(this.selectedValue.height * 3)
      // alert(this.selectedValue.width * 3)
      return 'height: ' + ((this.selectedValue.height * 3) || 0) +
      'px; width: ' + ((this.selectedValue.width * 3) || 0) + 'px;'
    },
    displayableMenu () {
      return this.menuCheck ? '' : 'hidden'
    },
    unitUsed () {
      return this.mode ? 'mm' : 'cm'
    },
    calculatedPoses () {
      const divider = this.mode ? 10 : 1
      const landscape = {
        height: this.spaceCalculation(this.selectedValue.height,
          this.valueH / divider,
          this.storeMargin,
          this.storeBleeding / divider),
        width: this.spaceCalculation(this.selectedValue.width,
          this.valueW / divider,
          this.storeMargin,
          this.storeBleeding / divider)
      }
      const portrait = {
        height: this.spaceCalculation(this.selectedValue.width,
          this.valueH / divider,
          this.storeMargin,
          this.storeBleeding / divider),
        width: this.spaceCalculation(this.selectedValue.height,
          this.valueW / divider,
          this.storeMargin,
          this.storeBleeding / divider)
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
  mounted () {
    // this.$nextTick(() => {
    console.log(this.$refs)
    const ctx = this.$refs.c.getContext('2d')
    this.vueCanvas = ctx
    // })
  },
  methods: {
    changeUnits (mode) {
      if (mode !== this.mode) {
        const multiplicateur = mode ? 10 : 0.1
        this.valueW = parseFloat((this.valueW * multiplicateur).toFixed(3))
        this.valueH = parseFloat((this.valueH * multiplicateur).toFixed(3))
        this.storeBleeding = parseFloat((this.storeBleeding * multiplicateur).toFixed(3))
        this.storeMargin = parseFloat((this.storeMargin * multiplicateur).toFixed(3))
        this.mode = mode
      }
    },
    selectValue (event) {
      this.selectedValue = event
      this.drawRect()
    },
    spaceCalculation (format, value, storeMargin, storeBleeding) {
      return parseInt((format - (storeMargin)) / (value + (2 * (storeBleeding)))) || 0
    },
    testRect (/* loopNumber */) {
      let optimalFormat = ''
      //   const drawDirection = ''
      if (this.calculatedPoses.landscape.total >= this.calculatedPoses.portrait.total) {
        optimalFormat = this.calculatedPoses.landscape
      } else {
        optimalFormat = this.calculatedPoses.portrait
      }
      // if (optimalFormat.width >= optimalFormat.height) {
      //     fillDirection = "width"
      // } else {
      //     fillDirection = "height"
      // }
      // var drawDirection = optimalFormat + "." + fillDirection
      // console.log(optimalFormat)
      for (let xIndex = 0; xIndex < optimalFormat.width; xIndex++) {
        console.log(optimalFormat.width)
        const xOffset = xIndex
        let yOffset = 0
        for (yOffset = 0; yOffset < optimalFormat.height; yOffset++) {
          this.vueCanvas.rect(
            ((xOffset * this.valueW) * 3), // écart entre chaque rect en x
            ((yOffset * this.valueH) * 3), // écart entre chaque rect en y
            (this.valueW * 3),
            (this.valueH * 3)
          )
          this.vueCanvas.fillStyle = 'rgb(255, 165, 0)'
          // remplissage des rectangles ci dessous
          this.vueCanvas.fillRect(
            ((xOffset * this.valueW) * 3),
            ((yOffset * this.valueH) * 3),
            (this.valueW * 3),
            (this.valueH * 3))
        }
      }
    },
    drawRect () {
      console.log('drawRect appelée')
      // récupérer la variable "total" via store
      // prendre en compte l'orientation
      // définir une variable offsetW & offsetH
      // faire une boucle sur la valeur de "total" et draw un nouveau rect à chaque 2*bleeding
      //          à droite du précédent sur une ligne de docW/valueW puis passer à la ligne
      // calculer en direct le breakpoint et update les offsets en fonction. Appeler ensuite le drawrect
      this.vueCanvas.clearRect(0, 0, 10000, 10000)
      const totalLandscape = this.calculatedPoses.landscape.total
      const totalPortrait = this.calculatedPoses.portrait.total
      let numberOfPoses = 0
      if (totalLandscape >= totalPortrait) {
        numberOfPoses = totalLandscape
      } else {
        numberOfPoses = totalPortrait
      }
      // this.vueCanvas.beginPath();
      // console.log(i)
      this.testRect(/* i */)
      this.vueCanvas.stroke()
      // this.vueCanvas.rect((this.storeMargin + this.storeBleeding) * 3,
      //                     (this.storeMargin + this.storeBleeding) * 3,
      //                     (this.valueW * 3), (this.valueH * 3));
      this.vueCanvas.beginPath()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
