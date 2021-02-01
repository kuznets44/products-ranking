<template>
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
</template>

<script>
export default {
  computed: {
    sellers() {
      console.log()
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