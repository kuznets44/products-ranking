<template>
  <div>
    <div v-if="!dataLoaded" :style="{
      width: '100%',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }">
      <v-progress-circular
        :size="100"
        color="blue"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-app v-if="dataLoaded" id="app">

      <v-dialog
        v-model="showDialog"
        max-width="500px"
        persistent
      >
        <v-card>
          <v-card-title>
            Сохранение данных
          </v-card-title>
          <v-card-text>
            {{ dialogMessage }}
          </v-card-text>
        </v-card>

      </v-dialog>

        <v-tabs left icons-and-text>
          <v-tab to="/" ripple>
            Каталоги
            <v-icon>mdi-cart-variant</v-icon>
          </v-tab>
          <v-tab to="/manufacturers/" ripple>
            Производители
            <v-icon>mdi-wrench</v-icon>
          </v-tab>
          <v-tab to="/sellers/" ripple>
            Продавцы
            <v-icon>mdi-point-of-sale</v-icon>
          </v-tab>
          <v-tab @click="save" ripple>
            Сохранить
            <v-icon>mdi-content-save</v-icon>
          </v-tab>
          <v-tab @click="close" ripple>
            Выйти
            <v-icon>mdi-logout</v-icon>
          </v-tab>
        </v-tabs>


      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>

  </div>
</template>



<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        dataLoaded: false,
        rankingFactors: [],
        rankingFactorsFlattened: [],
        manufacturers: [],
        sellers: [],
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
      save: async function() {
        this.showDialog = true;
        
        this.dialogMessage = `Обновляем параметры показателей ранжирования`;
        await axios.post(
          'https://mebel.ru/tools/api/product-ranking/factors/',
          'data=' + JSON.stringify(this.$store.getters.RANKING_FACTORS),{
            withCredentials: false,
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded' 
            },
          }
        );
        
        this.dialogMessage = 'Обновляем данные производителей';
          
        await axios.post(
          'https://mebel.ru/tools/api/product-ranking/manufacturers/',
          'data=' + JSON.stringify(this.$store.getters.MANUFACTURERS), {
            withCredentials: false,
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded'
            },
          }
        );
        
        this.dialogMessage = 'Обновляем данные продавцов';
        
        await axios.post(
          'https://mebel.ru/tools/api/product-ranking/sellers/',
          'data=' + JSON.stringify(this.$store.getters.SELLERS),  {
            withCredentials: false,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
          }
        );
        
        //обновляем каталог
        this.showDialogSpinner = true;

        let catalogs = this.$store.getters.CATALOGS;
        console.log(catalogs);
        for (let i in catalogs) {
          let catalog = catalogs[i];
          this.dialogMessage = `Обновляем ранги товаров каталога "${catalog.name}"`;

          await axios.post(
            'https://mebel.ru/tools/api/product-ranking/products/',
            `action=update&iblock_id=${catalog.id}`,{
              withCredentials: false,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
            }
          );
        }
              
        this.dialogMessage = 'Ранги товаров обновлены!';
        this.showDialogSpinner = false;
      },
      close: function(){
        window.location = 'https://mebel.ru/bitrix/admin/';
      }
    },
    beforeCreate() {
        this.$store.dispatch('GET_RANKING_SYSTEM_DATA')
          .then( () => this.dataLoaded = true);
    },
  }
</script>

<style>
  .v-application--wrap {
    min-height: calc(100% - 136px);
  }
  .v-data-footer__select {
    display: none!important;;
  }
</style>