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

    <md-tabs md-sync-route>
      <md-tab id="tab-home" md-label="Каталоги" to="/" md-icon="shopping_cart" exact></md-tab>
      <md-tab id="tab-manufacturers" md-label="Производители" to="/manufacturers" md-icon="build" exact></md-tab>
      <md-tab id="tab-sellers" md-label="Продавцы" to="/sellers" md-icon="point_of_sale" exact></md-tab>
      <md-tab id="tab-apply"  md-icon="save" md-label="Сохранить" @click="save()"></md-tab>
      <md-tab id="tab-return"  md-icon="logout" md-label="Выйти" @click="close()"></md-tab>
    </md-tabs>

    <router-view></router-view>
  </div>
</template>

<script>
import Catalogs from './components/Catalogs';
import Manufacturers from './components/Manufacturers';
import Sellers from './components/Sellers';
import axios from 'axios';

export default {
  components: [
    Catalogs,
    Manufacturers,
    Sellers
  ],
  data() {
    return {
      rankingFactors: [],
      rankingFactorsFlattened: [],
      manufacturers: [],
      sellers: [],
      catalogs: [],
      showDialog: false,
      dialogMessage: '',
      showDialogSpinner: false
    }
  },
  methods: {
    getRankingFactorsFlatenned() {
      let result = {};
      this.rankingFactors.forEach((factorGroup) => {
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
    save: function() {
      this.showDialog = true;
      
      this.dialogMessage = `Обновляем параметры показателей ранжирования`;
      axios.post('https://mebel.ru/tools/api/product-ranking/factors/','data=' + JSON.stringify(this.$store.getters.RANKING_FACTORS),{
        withCredentials: false,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then(() => {

        this.dialogMessage = 'Обновляем данные производителей';
        axios.post('https://mebel.ru/tools/api/product-ranking/manufacturers/','data=' + JSON.stringify(this.$store.getters.MANUFACTURERS),{
          withCredentials: false,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then(() => {

          this.dialogMessage = 'Обновляем данные продавцов';
          axios.post('https://mebel.ru/tools/api/product-ranking/sellers/','data=' + JSON.stringify(this.$store.getters.SELLERS),{
            withCredentials: false,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
          .then(() => {

            this.dialogMessage = `Обновляем ранги товаров каталога "${this.catalogs[this.catalogSelected].name}"`;
            //обновляем каталог
            this.showDialogSpinner = true;
            axios.post('https://mebel.ru/tools/api/product-ranking/products/',{
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
        })
      })
    },
    close: function(){
      window.location = 'https://mebel.ru/bitrix/admin/';
    }
  },
  beforeMount(){
    //this.$store.dispatch('GET_RANKING_FACTORS');
    this.$store.dispatch('GET_SELLERS');
    this.$store.dispatch('GET_MANUFACTURERS');
    this.$store.dispatch('GET_CATALOGS');
  },
}
</script>