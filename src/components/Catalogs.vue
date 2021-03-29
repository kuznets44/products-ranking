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
            Показатели
          </v-list-item-title>
        </v-list-item-content>
        <v-divider></v-divider>
        <v-btn
          fab
          dark
          small
          color="pink"
          @click="refresh()"
          :disabled="catalogSelected == undefined"
        >
          <v-icon dark>refresh</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <v-list-group
          v-for="(factorGroup,index) in rankingFactorsAsync"
          :key="index"
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
      rankingFactorsAsync: [],
      rankingFactorsFlattened: []
      //refreshButtonDisabled: true
    }
  },
  mounted() {
    this.rankingFactorsAsync = this.$store.getters.RANKING_FACTORS;
    this.rankingFactorsFlattened = this.getRankingFactorsFlatenned();
  },
  computed: {
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
    getRankingFactorsFlatenned() {
      let result = [];
      let rankingFactors = this.$store.getters.RANKING_FACTORS;

      rankingFactors.forEach((factorGroup) => {
        factorGroup.factors.forEach((factor) => {
          let params = [];
          factor.params.forEach(param => params.push(param));
          if(factor.active) {
            result.push({
              id: factor.id,
              name: factor.name,
              shortName: factor.shortName,
              weight: factor.weight,
              getValue: factor.getValue,
              params: params,
              active: factor.active
            });
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
  .v-card {
    color: rgba(0,0,0)!important;
    text-decoration: none!important;
  }
</style>