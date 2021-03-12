<template>
  <v-data-table
      :headers="headers"
      :items="manufacturers"
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

      <template v-slot:item.reviewsLower3="{ item }">
        {{ filterReviewsLower3(item) }}
      </template>

      <template v-slot:item.reviewsHigher3="{ item }">
        {{ filterReviewsHigher3(item) }}
      </template>

    </v-data-table>
  <!--
  <md-content class="md-primary">
    <md-table v-model="manufacturers" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell width="100" md-label="ID">{{ item.id }}</md-table-cell>
        <md-table-cell md-label="Название" class="md-cell__name">{{ item.name }}<div style="width:200px"></div></md-table-cell>
        <md-table-cell md-label="Отзывов всего" class="md-cell__name">{{ item.reviews.length }}<div style="width:200px"></div></md-table-cell>
        <md-table-cell md-label="Отзывов c оценкой до 3" class="md-cell__name">{{ filterReviewsLower3(item) }}</md-table-cell>
        <md-table-cell md-label="Отзывов c оценкой выше 3" class="md-cell__name">{{ filterReviewsHigher3(item) }}</md-table-cell>
        <md-table-cell width="100" md-label="Ранг">
            <input type="text" v-model="item.rankingPoints" @change="changeRankingPoints(item.id)" />
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
            value: 'id'
          },
          {
            text: 'Название',
            value: 'name',
            width: '250px'
          },
          {
            text: 'Ранг',
            value: 'rankingPoints'
          },
          {
            text: 'Отзывов всего',
            value: 'reviews.length'
          },
          {
            text: 'Отзывов c оценкой до 3',
            value: 'reviewsLower3'
          },
          {
            text: 'Отзывов c оценкой выше 3',
            value: 'reviewsHigher3'
          },
      ]
    };
  },
  computed: {
    manufacturers() {
      return this.$store.getters.MANUFACTURERS;
    }
  },
  methods: {
    changeRankingPoints(id) {
      const el = this.manufacturers.find( element => element.id == id ? element : undefined);
      this.$store.commit('SET_MANUFACTURER',el);
    },
    filterReviewsLower3(item) {
      return item.reviews.filter( review => parseInt(review.RATING) < 4 ).length;
    },
    filterReviewsHigher3(item) {
      return item.reviews.filter( review => parseInt(review.RATING) > 3 ).length;
    }
  }
}
</script>