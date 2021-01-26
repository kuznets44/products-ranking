<template>
  <div>
    <!--
    <md-table md-card>
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
    -->
    <md-table v-model="productsProcessed" md-card>
      <!--
      <md-table-toolbar>
        <h1 class="md-title">Users</h1>
      </md-table-toolbar>
      -->
      <md-table-row slot="md-table-row" slot-scope="{ item, index }">
        <md-table-cell md-label="ID" width="50">{{ index + 1 }}</md-table-cell>
        <md-table-cell md-label="Название" class="md-cell__name">{{ item.name }}<div style="width:200px"></div></md-table-cell>
        <md-table-cell md-label="Ранг" class="md-cell__rank">{{ item.rank }}</md-table-cell>

        <md-table-cell  v-for="(factor,i) in rankingFactorsFlattened"
                        :key="i"
                        :md-label="factor.shortName"
                        width="50">{{ item.factorValues[factor.id] }}</md-table-cell>
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
    width: 200px!important;
  }
  .md-cell__rank {
    width: 50px!important;
  }
  .md-table-cell-container {
    padding: 6px 12px 6px 12px;
  }
</style>