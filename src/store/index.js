import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import RankingFactor from '../RankingFactor.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    catalogs: [
      {"id":"1","name":"Кухни"},
      {"id":"2","name":"Диваны"},
      {"id":"3","name":"Шкафы"},
      {"id":"29","name":"Матрасы"},
      {"id":"40","name":"Кресла"},
      {"id":"41","name":"Столы"},
      {"id":"42","name":"Стулья"},
      {"id":"43","name":"Комоды и тумбы"},
      {"id":"48","name":"Кровати"},
      {"id":"49","name":"Садовая мебель"}
    ],
    catalogData: [],
    sellers: [],
    manufacturers: [],
    rankingFactors: []
  },
  mutations: {
    SET_SELLERS: (state, payload) => {
      state.sellers = payload;
    },
    SET_MANUFACTURERS: (state, payload) => {
      state.manufacturers = payload;
    },
    SET_CATALOGS: (state, payload) => {
      state.catalogs = payload;
    },
    SET_SELLER: (state, payload) => {
      const targetEl = state.sellers.find(element => element.id == payload.id ? element : undefined);
      targetEl.rankingPoints = payload.rankingPoints;
      targetEl.hasRetailPoint = payload.hasRetailPoint;
      targetEl.hasProfileFilled = payload.hasProfileFilled;
      targetEl.hasMebelruLink = payload.hasMebelruLink;
    },
    SET_MANUFACTURER: (state, payload) => {
      const targetEl = state.manufacturers.find(element => element.id == payload.id ? element : undefined);
      targetEl.rankingPoints = payload.rankingPoints;
    },
    SET_CATALOG_DATA: (state, payload) => {
      state.catalogData[payload.catalogId] = payload.catalogData;
    },
    SET_RANKING_FACTORS: (state, payload) => {
      state.rankingFactors = payload;
    },
    SET_RANKING_FACTOR: (state, payload) => {
      state.rankingFactors.forEach((factorGroup) => {
        factorGroup.factors.forEach(factor => {
          if(factor.id == payload.id) {
            factor = payload;
            return false;
          }
        });
      });
    },
  },
  getters: {
    SELLERS: state => {
      return state.sellers;
    },
    MANUFACTURERS: state => {
      return state.manufacturers;
    },
    CATALOGS: state => {
      return state.catalogs;
    },
    CATALOGS_DATA: (state) => {
      return state.catalogData;
    },
    RANKING_FACTORS: (state) => {
      return state.rankingFactors;
    }
  },
  actions: {
    GET_SELLERS: async (context) => {
      let {data} = await axios.get('https://mebel.ru/tools/api/product-ranking/sellers/');
      context.commit('SET_SELLERS', data);
    },
    GET_MANUFACTURERS: async (context) => {
      let {data} = await axios.get('https://mebel.ru/tools/api/product-ranking/manufacturers/');
      context.commit('SET_MANUFACTURERS', data);
    },
    GET_CATALOGS: (context) => {
      context.state.catalogs.forEach(async (item) => {
        let {data} = await axios.get('https://mebel.ru/tools/api/product-ranking/products/?catalog=' + item.id)
        console.log('Каталог ' + item.name + ' загружен!');
        context.commit('SET_CATALOG_DATA', {
          catalogId: item.id,
          catalogData: data
        })
      });
    },
    GET_CATALOG: async (context,catalog,callback) => {
      let {data} = await axios.get('https://mebel.ru/tools/api/product-ranking/products/?catalog=' + catalog.id)
      console.log('Каталог ' + catalog.name + ' загружен!');
      context.commit('SET_CATALOG_DATA', {
        catalogId: catalog.id,
        catalogData: data
      });
      callback();
    },
    GET_RANKING_FACTORS: async (context) => {
      let {data} = await axios.get('https://mebel.ru/tools/api/product-ranking/factors/');
      let rankingFactors = [];
      
      data.forEach((item) => {
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
        rankingFactors.push({
          id: item.id,
          name: item.name,
          icon: 'settings',
          expanded: true,
          factors: factors
        });
      });
      context.commit('SET_RANKING_FACTORS', rankingFactors);
    },
  }
});