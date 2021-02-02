<template>
  <div id="catalogs">
    <div class="page-container">
      <md-app md-scrollbar>
        <md-app-toolbar class="md-primary">
          <md-field>
            <label for="catalog">Каталог</label>
            <md-select v-model="catalogSelected" class="md-select__catalog" name="catalog" id="catalog">
              <md-option value="1">Кухни</md-option>
              <md-option value="2">Диваны</md-option>
              <md-option value="3">Шкафы</md-option>
              <md-option value="29">Матрасы</md-option>
              <md-option value="48">Кровати</md-option>
              <md-option value="40">Кресла</md-option>
              <md-option value="41">Столы</md-option>
              <md-option value="42">Стулья</md-option>
              <md-option value="43">Комоды и тумбы</md-option>
              <md-option value="49">Садовая мебель</md-option>
            </md-select>
          </md-field>
        </md-app-toolbar>

        <md-app-drawer  md-permanent="full"   style="height:calc(100vh - 72px); overflow:auto;">
          <md-toolbar class="md-transparent" md-elevation="0">
            <span class="md-title">Параметры ранжирования</span>
            <md-button  class="md-icon-button md-icon-button-right md-raised md-accent"
                        :disabled="!catalogSelected"
                        @click="refresh()">
              <md-icon>refresh</md-icon>
            </md-button>
          </md-toolbar>

          <md-list>
            <md-list-item v-for="(factorGroup,index) in rankingFactorsAsync"
                          :key="index"
                          md-expand
                           >
              <md-icon>{{ factorGroup.icon }}</md-icon>
              <span class="md-list-item-text">{{ factorGroup.name }}</span>

              <md-list slot="md-expand">
                <md-list-item  v-for="(factor,index) in factorGroup.factors"
                                        :key="index">
                  <RankingFactorComponent :factor="factor"></RankingFactorComponent>
                </md-list-item>
              </md-list>
            </md-list-item>
          </md-list>
        </md-app-drawer>



        <md-app-content  style="height:calc(100vh - 72px - 64px); overflow:auto;">
          <Catalog :catalogId="catalogSelected" :rankingFactorsFlattened="rankingFactorsFlattened" />
        </md-app-content>
      </md-app>
    </div>
  </div>
</template>

<script>
import Catalog from './Catalog.vue';
import RankingFactor from '../RankingFactor.js';
import RankingFactorComponent from './RankingFactorComponent.vue';
import axios from 'axios';

export default {
  name: 'Catalogs',
  components: {
    Catalog,
    RankingFactorComponent,
  },
  data() {
    return {
      showDialog: false,
      catalogs: [],
      dialogMessage: '',
      rankingFactorsFlattened: [],
      rankingFactorsAsync: [],
      catalogSelected: undefined,
      catalogItems: [],
      factorsListExpanded: true,
      products: [],
      productsProcessed: [],
      showSpinner: false,
      showDialogSpinner: false,
      factorsChanged: false,
      //refreshButtonDisabled: true
    }
  },
  methods: {
    getRankingFactorsFlatenned() {
      let result = {};
      this.rankingFactorsAsync.forEach((factorGroup) => {
        factorGroup.factors.forEach((factor) => {
          let params = [];
          factor.params.forEach(param => params.push(param));
          if(factor.active) {
            result[factor.id] = {
              id: factor.id,
              name: factor.name,
              shortName: factor.shortName,
              weight: factor.weight,
              getValue: factor.getValue,
              params: params,
              active: factor.active
            };
          }
        });
      });
      return result;
    },
    refresh: function() {
      this.$store.commit('SET_RANKING_FACTORS', this.rankingFactorsAsync);
      this.rankingFactorsFlattened = this.getRankingFactorsFlatenned();
    },
    close: function(){
      window.location = 'https://mebel.ru/bitrix/admin/';
    }
  },
  beforeMount() {
    this.catalogs = this.$store.getters.CATALOGS;
  },
  mounted: function () {
    axios.get('https://mebel.ru/tools/api/product-ranking/factors/')
      .then((response) => {
        response.data.forEach((item) => {
          let factors = [];
          for(let i in item.factors) {
            let factor = item.factors[i];
            factors.push(new RankingFactor(
              factor.id,
              factor.name,
              factor.shortName,
              factor.weight,
              factor.paramsComponent,
              eval(`(function(product) {
                ${factor.functionCode}
              })`),
              factor.params,
              factor.active == 'Y' ? true : false
            ));
          }
          this.rankingFactorsAsync.push({
            id: item.id,
            name: item.name,
            icon: 'settings',
            expanded: true,
            factors: factors
          });
        });
        this.rankingFactorsFlattened = this.getRankingFactorsFlatenned();
        this.$store.commit('SET_RANKING_FACTORS', this.rankingFactorsAsync);
      });      
  }
}
</script>

<style scoped>

  .md-icon-button-right {
    position:absolute;
    right: 10px;
  }
  
  .md-card {
    width: 100%;
  }

  .slider {
    padding: 0!important;
    margin: 0!important;
  }

  .slider-wrapper {
    left:0!important;
    right:0!important;
  }

  .md-card-content {
    padding-left: 24px!important;
  }
  .md-list-item-button {
    padding-left: 10px!important;
  }
</style>