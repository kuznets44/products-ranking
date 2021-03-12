<template>
  <div>
    <v-container
              class="px-0"
              fluid
            >
      <v-text-field
              dense
              type="number"
              label="Баллов за каждую статью"
              v-model="params[0]"
              hide-details="auto"
            ></v-text-field>
    </v-container>
    <v-container
              class="px-0"
              fluid
            >
      <v-text-field
              dense
              type="number"
              label="Баллов максимально"
              v-model="params[1]"
              hide-details="auto"
            ></v-text-field>
    </v-container>
  </div>
  <!--
  <div>
    <md-field>
      <label>Баллов за каждую статью</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
    <md-field>
      <label>Баллов максимально</label>
      <md-input type="number" v-model="params[1]"></md-input>
    </md-field> 
  </div>
  -->
</template>

<script>
export default  {
  name: 'FactorSellerArticles',
  props: ['params']
}
</script>