<template>
  <md-field>
      <label>Баллов при наличии описания</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
</template>

<script>
export default  {
  name: 'FactorDetailText',
  props: ['params']
}
</script>