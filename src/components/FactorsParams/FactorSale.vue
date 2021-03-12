<template>
  <div>
    <v-container
              class="px-0"
              fluid
            >
      <v-text-field
              dense
              type="number"
              size="5"
              label="Баллов при наличии скидки"
              v-model="params[0]"
              hide-details="auto"
            ></v-text-field>
    </v-container>
  </div>
  <!--
  <md-field>
      <label>Баллов при наличии скидки</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
  -->
</template>

<script>
export default  {
  name: 'FactorSale',
  props: ['params']
}
</script>