<template>
  <hot-table :data="productsProcessed">
    <hot-column title="Название" data="name">
    </hot-column>
    <hot-column title="Ранг" data="rank">
    </hot-column>
  </hot-table>
</template>

<script>
  import { HotTable } from '@handsontable/vue';

  export default {
    name: 'CatalogSpreadsheet',
    props: ['products','rankingFactorsFlattened'],
    data: function() {
      return {
        productsProcessed: this.processProductsData()
      }
    },
    components: {
      HotTable
    },
    methods: {
    processProductsData: function(){
      let result = [];
      this.products.forEach((product) => {
        let rank = 0;
        let factorValues = [];
        for(var factorId in this.rankingFactorsFlattened) {
          let factor = this.rankingFactorsFlattened[factorId];
          let total = 0;
          //if(factor.active) {
            let factorValue = factor.getValue(product);
            total = factorValue * factor.weight;
            rank += total;
          //}
          factorValues[factor.id] = total;
        }
        result.push({
          'id': product.ID,
          'name': product.NAME,
          'rank': rank,
          'factorValues': factorValues
        });
      });
      result.sort((a, b) => a.rank < b.rank ? 1 : -1);
      console.log(result.slice(0,5));
      return result.slice(0,36);
    }
  },
  }
</script>

<style src="../../node_modules/handsontable/dist/handsontable.full.css"></style>