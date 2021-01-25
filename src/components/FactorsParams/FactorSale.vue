<template>
  <md-field>
      <label>Баллов при наличии скидки</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
</template>

<script>
export default  {
  name: 'FactorSale',
  props: ['params']
}
</script>