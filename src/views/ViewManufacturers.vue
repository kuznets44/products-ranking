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