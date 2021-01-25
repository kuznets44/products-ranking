<template>
  <md-field>
      <label>Баллов при наличии лого и ссылки на mebel.ru</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
</template>

<script>
export default  {
  name: 'FactorLogoLink',
  props: ['params']
}
</script>