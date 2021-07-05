export const state = () => ({
  marginValue: 0,
  bleedingValue: 0
})

export const getters = {
  getterMarginValue: state => {
    return state.marginValue
  },
  getterBleedingValue: state => {
    return state.bleedingValue
  }
}

export const mutations = {
  setMarginValue: (state, payload) => {
    state.marginValue = payload
  },
  setBleedingValue: (state, payload) => {
    state.bleedingValue = payload
  }
}
