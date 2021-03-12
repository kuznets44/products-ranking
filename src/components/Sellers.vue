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
  <!--
  <md-content class="md-primary">
    <md-table v-model="sellers" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell width="100" md-label="ID">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Название" class="md-cell__name">{{ item.name }}<div style="width:200px"></div></md-table-cell>
        <md-table-cell width="100" md-label="Ранг">
            <input type="text" v-model="item.rankingPoints" @change="changeRankingPoints(item.id)" />
        </md-table-cell>
        <md-table-cell width="100" md-label="Есть ссылка и лого Mebel.ru на сайте">
          <input type="checkbox"  @change="changeRankingPoints(item.id)" v-model="item.hasMebelruLink" value="true" />
        </md-table-cell>
        <md-table-cell width="100" md-label="Есть розничная точка">
          <input type="checkbox"  @change="changeRankingPoints(item.id)" v-model="item.hasRetailPoint" value="true" />
        </md-table-cell>
        <md-table-cell width="100" md-label="Профиль заполнен">
          <input type="checkbox"  @change="changeRankingPoints(item.id)" v-model="item.hasProfileFilled" value="true" />
        </md-table-cell>
      </md-table-row>
    </md-table>
  </md-content>
  -->
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