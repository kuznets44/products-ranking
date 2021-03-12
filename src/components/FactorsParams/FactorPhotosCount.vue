<template>
  <div>
    <v-container
            class="px-0"
            fluid
          >
      <v-text-field
              dense
              type="number"
              label="Баллов при 1, 2 фото"
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
              label="Баллов при 3 фото"
              v-model="params[1]"
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
              label="Баллов при 4 и более фото"
              v-model="params[2]"
              hide-details="auto"
            ></v-text-field>
    </v-container>
    <!--
    <md-field>
      <label>Баллов при 1, 2 фото</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field>  
    <md-field>
      <label>Баллов при 3 фото</label>
      <md-input type="number" v-model="params[1]"></md-input>
    </md-field> 
    <md-field>
      <label>Баллов при 4 и более фото</label>
      <md-input type="number" v-model="params[2]"></md-input>
    </md-field>  
    -->
  </div>
</template>

<script>
export default {
  name: 'FactorPhotosCount',
  props: ['params']
}
</script>