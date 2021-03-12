<template>
  <div>
    <v-container
            class="px-0"
            fluid
          >
      <v-text-field
              dense
              type="number"
              label="Баллов при наличии отзывов"
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
              label="Минус при наличии отз. до 3 ★"
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
              label="Плюс при наличии отз. больше 3 ★"
              v-model="params[2]"
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
              label="Плюс, если более 5 отзывов"
              v-model="params[3]"
              hide-details="auto"
            ></v-text-field>
    </v-container>    
    <!--
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
    -->
  </div>
</template>

<script>
export default {
  name: 'FactorReviews',
  props: ['params']
}
</script>