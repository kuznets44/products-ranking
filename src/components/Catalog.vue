<template>
  <div>
    <md-table v-if="catalogId !== undefined" v-model="productsProcessed" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item, index }">
        <md-table-cell md-label="ID" width="50">{{ index + 1 }}</md-table-cell>
        <md-table-cell md-label="Название" class="md-cell__name">{{ item.name }}<div style="width:200px"></div></md-table-cell>
        <md-table-cell md-label="Производитель" class="md-cell__name">{{ item.manufacturerName }}</md-table-cell>
        <md-table-cell md-label="Продавец" class="md-cell__name">{{ item.sellerName }}</md-table-cell>
        <md-table-cell md-label="Ранг" class="md-cell__rank">{{ item.rank }}</md-table-cell>

        <md-table-cell  v-for="(factor,i) in rankingFactorsFlattened"
                        :key="i"
                        :md-label="factor.shortName"
                        width="50">{{ item.factorValues[factor.id] }}</md-table-cell>
      </md-table-row>
    </md-table>
    <md-empty-state
      v-if="catalogId == undefined"
      md-icon="devices_other"
      md-label="Выберите каталог"
      md-description="">
    </md-empty-state>
  </div>
</template>

<script>

export default {
  name: 'Catalog',
  props: ['catalogId','rankingFactorsFlattened'],
  data: function() {
    return {
      productsProcessed: [],
    }
  },
  methods: {
    processProductsData: function(){
      let result = [];
      let products = this.$store.getters.CATALOGS_DATA[this.catalogId];
      
      products.forEach((product) => {
        product.manufacturer = this.$store.getters.MANUFACTURERS.find(element => element.id == product.manufacturerId ? element : undefined);
        product.seller = this.$store.getters.SELLERS.find(element => element.id == product.sellerId ? element : undefined);
        let rank = 0;
        let factorValues = [];
        for(var factorId in this.rankingFactorsFlattened) {
          let factor = this.rankingFactorsFlattened[factorId];
          let total = 0;
          if(factor.active) {
            let factorValue = factor.getValue(product);
            total = factorValue * factor.weight;
            rank += total;
          }
          factorValues[factor.id] = total;
        }
        result.push({
          'id': product.id,
          'name': product.name,
          'rank': rank,
          'sellerName': product.seller ? product.seller.name : '',
          'manufacturerName': product.manufacturer ? product.manufacturer.name : '',
          'factorValues': factorValues
        });
      });
      result.sort((a, b) => a.rank < b.rank ? 1 : -1);
      return result.slice(0,36);
    }
  },
  
  watch: {
    catalogId: {
      immediate: true,
      handler: function() {
        //console.log('catalogId changed',this.catalogId);
        if(this.catalogId !== undefined) {
          setTimeout(() => this.productsProcessed = this.processProductsData(), 10);
        }
      }
    },
    rankingFactorsFlattened: {
      deep: true,
      immediate: true,
      handler: function() {
        if(this.catalogId !== undefined) {
          setTimeout(() => this.productsProcessed = this.processProductsData(), 10);
        }
      }
    }
  }
  
}
</script>

<style>
  .md-cell__position {
    width:30px;
  }
  input[name="catalog"] {
    color:#fff!important;
  }
  .md-cell__name {
    width: 200px!important;
  }
  .md-cell__rank {
    width: 50px!important;
  }
  .md-table-cell-container {
    padding: 6px 12px 6px 12px;
  }
</style>