<template>
  <div>
    <v-container
              class="px-0"
              fluid
            >
      <v-text-field
              dense
              type="number"
              label="Баллов при наличии розничной точки"
              v-model="params[0]"
              hide-details="auto"
            ></v-text-field>
    </v-container>
  </div>
  <!--
  <md-field>
      <label>Баллов при наличии розничной точки</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
    -->
</template>

<script>
export default  {
  name: 'FactorRetailPoint',
  props: ['params']
}
</script>