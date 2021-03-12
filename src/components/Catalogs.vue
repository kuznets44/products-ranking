<template>
  <v-app id="catalogs">
    <v-navigation-drawer
      :style="{'top':'80px','height': 'calc(100vh - 80px)'}"
      v-model="drawer"
      width="400"
      app
    >
    
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Показатели ранжирования
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-group
          v-for="(factorGroup,index) in rankingFactorsAsync"
          :key="index"
          v-model="factorGroup.active"
          prepend-icon="mdi-cog"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="factorGroup.name"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="(factor,index) in factorGroup.factors"
            :key="index"
          >
              <RankingFactorComponent :factor="factor"></RankingFactorComponent>
          </v-list-item>
      </v-list-group>
    </v-list>


    </v-navigation-drawer>

    <v-app-bar app :style="{'top':'80px'}" color="blue">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title color="white">{{ getTitle }}</v-toolbar-title>
    </v-app-bar>

    <!-- empty state -->
    <v-container v-if="catalogSelected == undefined" :style="{marginTop:'10px'}">
      <v-row>
        <v-col
          v-for="item in catalogs"
          :key="item.id"
          cols="3"
        >
          <v-card :to="`/catalogs/${item.code}/`"
                  :img="item.picture"
                  tile
                  height="200">
            <v-card-title style="background-color:rgba(255,255,255,0.4)">{{ item.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <Catalog v-if="catalogSelected !== undefined" :catalogId="catalogSelected" :rankingFactorsFlattened="rankingFactorsFlattened" />

  </v-app>
</template>

<!--
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
-->
<script>
import Catalog from './Catalog.vue';
import RankingFactorComponent from './RankingFactorComponent.vue';

export default {
  name: 'Catalogs',
  components: {
    Catalog,
    RankingFactorComponent,
  },
  data() {
    return {
      drawer: null,
      showDialog: false,
      dialogMessage: '',
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
  computed: {
    rankingFactorsAsync() {
      return this.$store.getters.RANKING_FACTORS;
    },
    rankingFactorsFlattened() {
      let result = {};
      let rankingFactors = this.$store.getters.RANKING_FACTORS;

      rankingFactors.forEach((factorGroup) => {
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
    getTitle() {
      return 'Каталоги';
    },
    catalogs() {
      return this.$store.getters.CATALOGS;
    },
    catalogSelected() {
      if(this.$route.params.code !== undefined) {
        return this.catalogs.find( item => item.code == this.$route.params.code ).id;
      } else {
        return undefined;
      }
    },
  },
  methods: {
    refresh: function() {
      this.$store.commit('SET_RANKING_FACTORS', this.rankingFactorsAsync);
      this.rankingFactorsFlattened = this.getRankingFactorsFlatenned();
    },
    close: function(){
      window.location = 'https://mebel.ru/bitrix/admin/';
    }
  },
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