<template>
  <div>
    <v-list-item-title>{{ factor.name }}</v-list-item-title>
    <v-list>
      <v-list-item>
        <v-text-field
          dense
          label="Вес"
          v-model="factor.weight"
          :rules="weightRules"
          hide-details="auto"
        ></v-text-field>
        <v-container
          class="px-0"
          fluid
        >
          <v-checkbox
            dense
            v-model="factor.active"
            label="Акт."
          ></v-checkbox>
        </v-container>
        <!--
        <div class="md-layout">
          <div class="md-layout-item">
            <md-field>
              <label>Вес</label>
              <md-input type="number" v-model="factor.weight"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-layout-item__checkbox">
            <input type="checkbox" class="md-check" v-model="factor.active" :id="'act_' + factor.id" />
            <label :for="'act_' + factor.id">Акт.</label>
          </div>
        </div>
        -->
      </v-list-item>
      <v-list-item v-if="factor.paramsComponent !== null" >
        <component :is="factor.paramsComponent" :params="factor.params"></component>
      </v-list-item>
    </v-list>
  </div>
</template>

<!--
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
            <input type="checkbox" class="md-check" v-model="factor.active" :id="'act_' + factor.id" />
            <label :for="'act_' + factor.id">Акт.</label>
          </div>
        </div>
      </md-list-item>
      <md-list-item v-if="factor.paramsComponent != ''" >
        <component :is="factor.paramsComponent" :params="factor.params"></component>
      </md-list-item>
    </md-list>
  </div>
</template>
-->

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
  },
  data() {
    return {
      weightRules: [
        value => !!value || 'Обязательное поле'
      ]
    };
  }
}
</script>

<style scoped>
  .md-layout-item__checkbox {
    padding-top: 25px;
  }
  .v-list {
    margin-bottom: 20px!important;
  }
  .v-list-item {
    padding:0!important;
  }
</style>