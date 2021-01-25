<template>
  <div>
    <md-subheader>{{ factor.name }}</md-subheader>
    
    <md-list>
      <md-list-item>
        <div class="md-layout">
          <div class="md-layout-item">
            <md-field>
              <label>Вес</label>
              <md-input type="number" v-model="factor.weight"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-layout-item__checkbox">
            <md-checkbox v-model="factor.active">Активен</md-checkbox>
          </div>
        </div>
      </md-list-item>
      <md-list-item v-if="factor.paramsComponent != ''" >
        <component :is="factor.paramsComponent" :params="factor.params"></component>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import FactorPhotosCount from './FactorsParams/FactorPhotosCount.vue';
import FactorDetailText from './FactorsParams/FactorDetailText.vue';
import FactorChars from './FactorsParams/FactorChars.vue';
import FactorReviews from './FactorsParams/FactorReviews.vue';
import FactorSale from './FactorsParams/FactorSale.vue';
import FactorRetailPoint from './FactorsParams/FactorRetailPoint.vue';
import FactorProfile from './FactorsParams/FactorProfile.vue';
import FactorLogoLink from './FactorsParams/FactorLogoLink.vue';
import FactorSellerActions from './FactorsParams/FactorSellerActions.vue';
import FactorSellerArticles from './FactorsParams/FactorSellerArticles.vue';

export default {
  name: 'RankingFactorComponent',
  props: ['factor'],
  components: {
    FactorPhotosCount,
    FactorDetailText,
    FactorChars,
    FactorReviews,
    FactorSale,
    FactorRetailPoint,
    FactorProfile,
    FactorLogoLink,
    FactorSellerActions,
    FactorSellerArticles
  }
}
</script>

<style scoped>
  .md-layout-item__checkbox {
    padding-top: 10px;
  }
</style>