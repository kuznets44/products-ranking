<template>
  <div>
    <md-field>
      <label>Баллов за каждую акцию</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
    <md-field>
      <label>Баллов максимально</label>
      <md-input type="number" v-model="params[1]"></md-input>
    </md-field> 
  </div>
</template>

<script>
export default  {
  name: 'FactorSellerActions',
  props: ['params']
}
</script>