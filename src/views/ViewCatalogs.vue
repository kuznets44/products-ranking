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

      <v-list-group
        :key="99"
        prepend-icon="mdi-cog"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>Формула расчета</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item class="ml-0"
          :key="999"
        >
          <prism-editor class="my-editor height-200" v-model="formula" :highlight="highlighter" line-numbers></prism-editor>
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

    <Catalog v-if="catalogSelected !== undefined" :catalogId="catalogSelected" :sectionId="sectionSelected" :rankingFactorsFlattened="rankingFactorsFlattened" />

  </v-app>
</template>


<script>
import Catalog from '../components/Catalog.vue';
import RankingFactorComponent from '../components/RankingFactorComponent.vue';
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles
 

export default {
  name: 'ViewCatalogs',
  components: {
    Catalog,
    RankingFactorComponent,
    PrismEditor
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
      rankingFactorsFlattened: [],
      formula: ''
      //refreshButtonDisabled: true
    }
  },
  mounted() {
    this.rankingFactorsAsync = this.$store.getters.RANKING_FACTORS;
    this.formula = this.$store.getters.FORMULA;
    this.rankingFactorsFlattened = this.getRankingFactorsFlatenned();
  },
  computed: {
    getTitle() {
      if( this.catalogSelected !== undefined) {
        let catalog = this.$store.getters.CATALOGS.find( item => item.id === this.catalogSelected);
        return `Каталоги / ${catalog.name}`;
      } else {
        return 'Каталоги';
      }
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
    sectionSelected() {
      if(this.$route.params.code !== undefined && this.$route.params.section !== undefined) {
        let catalog = this.catalogs.find( item => item.code == this.$route.params.code );
        if(catalog !== undefined) {
          let section = catalog.sections.find( item => item.code === this.$route.params.section );
          if(section !== undefined) {
            return section.id;
          }
        }
      } else {
        return undefined;
      }
    },
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.js); //returns html
    },
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
      this.$store.commit('SET_FORMULA', this.formula);
      this.rankingFactorsFlattened = this.getRankingFactorsFlatenned();
    },
    close: function(){
      window.location = 'https://mebel.ru/bitrix/admin/';
    }
  },
}
</script>

<style scoped>

  .height-200 {
    height: 200px;
    border:1px solid rgba(0, 0, 0, 0.12);
  }

  .md-icon-button-right {
    position:absolute;
    right: 10px;
  }

  .ml-0 {
    margin-left: 0!important;
    padding-left: 0!important;
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
    color: #000000!important;
    text-decoration: none!important;
  }

  /* required class */
  .my-editor {
    /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
    background: #2d2d2d;
    color: #ccc;
 
    /* you must provide font-family font-size line-height. Example: */
    font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 5px;
  }
 
  /* optional class for removing the outline */
  .prism-editor__textarea:focus {
    outline: none;
  }
</style>