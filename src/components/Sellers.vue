<template>
    <v-data-table
      :headers="headers"
      :items="sellers"
      :items-per-page="15"
      class="elevation-1"
      dense
      sort-by="points"
      sort-desc
    >

      <template v-slot:item.rankingPoints="{ item }">
        <v-text-field
          dense
          v-model="item.rankingPoints"
          hide-details="auto"
        ></v-text-field>
      </template>

      <template v-slot:item.hasMebelruLink="{ item }">
        <v-checkbox
          dense
          v-model="item.hasMebelruLink"
        ></v-checkbox>
      </template>

      <template v-slot:item.hasRetailPoint="{ item }">
        <v-checkbox
          dense
          v-model="item.hasRetailPoint"
        ></v-checkbox>
      </template>

      <template v-slot:item.hasProfileFilled="{ item }">
        <v-checkbox
          dense
          v-model="item.hasProfileFilled"
        ></v-checkbox>
      </template>

    </v-data-table>

</template>

<script>
export default {
  data() {
    return {
      headers: [
          {
            text: 'ID',
            value: 'id',
            width: 100
          },
          {
            text: 'Название',
            value: 'name',
          },
          {
            text: 'Ранг',
            value: 'rankingPoints',
            width: 200,
            align: 'center'
          },
          {
            text: 'Есть ссылка и лого Mebel.ru на сайте',
            value: 'hasMebelruLink',
            width: 200,
            align: 'center'
          },
          {
            text: 'Есть розничная точка',
            value: 'hasRetailPoint',
            width: 200,
            align: 'center'
          },
          {
            text: 'Профиль заполнен',
            value: 'hasProfileFilled',
            width: 200,
            align: 'center'
          },
      ]
    }
  },
  computed: {
    sellers() {
      return this.$store.getters.SELLERS;
    }
  },
  methods: {
    changeRankingPoints(id) {
      const el = this.sellers.find( element => element.id == id ? element : undefined);
      this.$store.commit('SET_SELLER',el);
    }
  }
}
</script>
<style>
  .v-input--selection-controls__input {
    flex-grow: 1!important;
  }
  .v-input--selection-controls.v-input--dense .v-input--selection-controls__ripple {
    left: calc(50% - 21px);
  }
</style>