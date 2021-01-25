<template>
  <md-field>
      <label>Баллов при наличии розничной точки</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
</template>

<script>
export default  {
  name: 'FactorRetailPoint',
  props: ['params']
}
</script>