<template>
  <div style="height:100vh;">
    <md-table>
      <md-table-row>
        <md-table-head md-numeric class="md-cell__position">#</md-table-head>
        <md-table-head width="200">Название</md-table-head>
        <md-table-head md-numeric>Ранг</md-table-head>
        
        <md-table-head  md-numeric  
                        v-for="(factor,index) in rankingFactorsFlattened"
                        :key="index">
          {{ factor.shortName }} <small>({{ factor.weight }})</small>
        </md-table-head>
        
      </md-table-row>

      <md-table-row v-for="(product,index) in productsProcessed"
                    :key="index">
        <md-table-cell md-numeric class="md-cell__position">{{ index + 1 }}</md-table-cell>
        <md-table-cell class="md-cell__name">{{ product.name }}</md-table-cell>
        <md-table-cell md-numeric>{{ product.rank }}</md-table-cell>
    
        <md-table-cell md-numeric
                        v-for="(factor,index) in rankingFactorsFlattened"
                        :key="index">
          {{ product.factorValues[factor.id] }}
        </md-table-cell>
        
      </md-table-row>
    </md-table>
  </div>
</template>

<script>

export default {
  name: 'Catalog',
  props: ['products','rankingFactorsFlattened'],
  data: function() {
    return {
      //rankingFactorsFlattened: this.getRankingFactorsFlatenned(),
      productsProcessed: this.processProductsData()
    }
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
  watch: {
    rankingFactorsFlattened: {
      deep: true,
      immediate: true,
      handler: function() {
        this.productsProcessed = this.processProductsData();
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
    width: 200px;
  }
</style>