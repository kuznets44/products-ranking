<template>
  <div id="app">
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Сохранение изменений</md-dialog-title>

      <md-dialog-content>
        {{ dialogMessage }}
        <md-progress-bar v-if="showDialogSpinner" md-mode="query"></md-progress-bar>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="showDialog = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div class="page-container">
      <md-app md-scrollbar>
        <md-app-toolbar class="md-primary">
          <md-field>
          <label for="catalog">Каталог</label>
          <md-select v-model="catalogSelected" @md-selected="loadCatalog" class="md-select__catalog" name="catalog" id="catalog">
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

        <md-app-drawer  md-permanent="clipped">
          <md-toolbar class="md-transparent" md-elevation="0">
            <span class="md-title">Параметры ранжирования</span>
          </md-toolbar>

          <md-list>
            <md-list-item v-for="(factorGroup,index) in rankingFactorsAsync"
                          :key="index"
                           md-expand
                           :md-expanded.sync="factorGroup.expanded">
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

          <md-bottom-bar>
            <md-bottom-bar-item md-label="Просмотр" md-icon="refresh"></md-bottom-bar-item>
            <md-bottom-bar-item md-label="Сохранить" md-icon="save" @click="saveParams"></md-bottom-bar-item>
          </md-bottom-bar>

        </md-app-drawer>



        <md-app-content>
          <md-progress-bar v-if="showSpinner" md-mode="query"></md-progress-bar>
          <Catalog v-if="products.length > 0" :products="products" :rankingFactorsFlattened="rankingFactorsFlattened" />
          <md-empty-state
            v-if="!showSpinner && products.length == 0"
            md-icon="devices_other"
            md-label="Выберите каталог"
            md-description="">
          </md-empty-state>
        </md-app-content>
      </md-app>
    </div>
  </div>
</template>

<script>
import Catalog from './components/Catalog.vue';
import RankingFactor from './RankingFactor.js';
import RankingFactorComponent from './components/RankingFactorComponent.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    Catalog,
    RankingFactorComponent
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
      catalogCmpKey: this.setCatalogCmpKey(),
      showDialogSpinner: false,
      factorsChanged: false
    }
  },
  methods: {
    setCatalogCmpKey: function() {
      console.log(new Date().getTime());
      return new Date().getTime();
    },
    loadCatalog: function(value) {
      this.showSpinner = true;
      this.products = [];
      axios.get('https://mebel.ru/tools/api/product-ranking/products/?catalog=' + value)
      .then((response) => {
        this.products = response.data
        this.showSpinner = false;
      })
    },
    getRankingFactorsFlatenned() {
      let result = {};
      this.rankingFactorsAsync.forEach((factorGroup) => {
        factorGroup.factors.forEach((factor) => {
          if(factor.active) {
            result[factor.id] = {
              id: factor.id,
              name: factor.name,
              shortName: factor.shortName,
              weight: factor.weight,
              getValue: factor.getValue,
              params: factor.params,
              active: factor.active
            };
          }
        });
      });
      return result;
    },
    saveParams: function() {
      this.showDialog = true;
      axios.post('https://mebel.ru/tools/api/product-ranking/factors/','data=' + JSON.stringify(this.rankingFactorsAsync),{
        withCredentials: false,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then(() => {
        this.dialogMessage = `Обновляем ранги товаров каталога "${this.catalogs[this.catalogSelected].name}"`;
        //обновляем каталог
        this.showDialogSpinner = true;
        axios.post('https://mebel.ru/tools/api/product-ranking/products/','catalog=' + this.catalogSelected,{
          withCredentials: false,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then(() => {
          this.dialogMessage = 'Ранги товаров обновлены!';
          this.showDialogSpinner = false;
        })
        .catch((err) => {
          console.log(err);
          this.dialogMessage = 'Ранги товаров обновлены!';
          this.showDialogSpinner = false;
        });
      })
    }
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
      });

    axios.get('https://mebel.ru/tools/api/product-ranking/catalogs/')
      .then((response) => {  
        response.data.forEach(catalog => this.catalogs[catalog.id] = catalog);
      });
      
  }
}
</script>

<style scoped>
  .md-app {
    border: 1px solid rgba(#000, .12);
    width:100%;
    height: 800px;
  }

  .md-app-drawer {
    height: 735px;
    position: relative;
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
  #app {
    border:1px solid red;
    width:80vw;
    height: 75vh;
  }
  .page-container {
    border:1px solid green;
  }
  .md-select__catalog input {
    background: transparent!important;
    border: none;
    box-shadow: none;
  }
</style>

