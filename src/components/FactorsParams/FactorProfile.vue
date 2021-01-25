<template>
  <md-field>
      <label>Отнять баллов при незаполненном профиле</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
</template>

<script>
export default  {
  name: 'FactorProfile',
  props: ['params']
}
</script>