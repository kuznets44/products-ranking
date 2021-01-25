<template>
  <div>
    <md-field>
      <label>Баллов при наличии отзывов</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field>  
    <md-field>
      <label>Минус при наличии отз. до 3 звезд</label>
      <md-input type="number" v-model="params[1]"></md-input>
    </md-field> 
    <md-field>
      <label>Плюс при наличии отз. больше 3 звезд</label>
      <md-input type="number" v-model="params[2]"></md-input>
    </md-field>
    <md-field>
      <label>Плюс, если более 5 отзывов</label>
      <md-input type="number" v-model="params[3]"></md-input>
    </md-field>  
  </div>
</template>

<script>
export default {
  name: 'FactorReviews',
  props: ['params']
}
</script>