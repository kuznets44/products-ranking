<template>
  <div>
    <v-container
              class="px-0"
              fluid
            >
      <v-text-field
              dense
              type="number"
              label="Отнять баллов при незаполненном профиле"
              v-model="params[0]"
              hide-details="auto"
            ></v-text-field>
    </v-container>
  </div>
  <!--
  <md-field>
      <label>Отнять баллов при незаполненном профиле</label>
      <md-input type="number" v-model="params[0]"></md-input>
    </md-field> 
    -->
</template>

<script>
export default  {
  name: 'FactorProfile',
  props: ['params']
}
</script>