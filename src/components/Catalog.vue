<template>
  <v-container>

    <v-tabs
      v-model="tab"
    >
      <v-tabs-slider color="primary"></v-tabs-slider>

      <v-tab
        v-for="section in catalog.sections"
        :key="section.id"
        :to="section.code !== 'new-products' ? `/catalogs/${catalog.code}/${section.code}/` : `/catalogs/${catalog.code}/`"
      >
        {{ section.code !== 'new-products' ? section.name : `Все ${catalog.name.toLowerCase()}` }}
      </v-tab>
    </v-tabs>

    <v-data-table v-if="catalogDataProcessed.length !== 0 && !productsProcessing"
      :headers="headers"
      :items="catalogDataProcessed"
      :items-per-page="36"
      class="elevation-1"
      dense
      sort-by="rankWeighted"
      sort-desc
    >

      <template v-slot:item.index="{ item }">
        {{ item.index }}
      </template>

      <template v-slot:item.name="{ item }">
        <a :href="`https://mebel.ru${item.url}`" target="_blank">{{ item.name }}</a>
      </template>

      <v-data-footer disable-items-per-page></v-data-footer>
    </v-data-table>
  </v-container>
</template>

<script>

  const loadCatalog = async function() {
    this.catalogData = [];

    this.catalog = this.$store.getters.CATALOGS.find( item => item.id === this.catalogId );
    if(this.$store.getters.CATALOGS_DATA[this.catalogId] == undefined) {
      this.$store.dispatch('GET_CATALOG_DATA',{catalogId: this.catalogId})
        .then(() => {
          this.catalogData = this.$store.getters.CATALOGS_DATA[this.catalogId]
          this.catalogDataProcessed = this.processProductsData();
        });
    } else {
      this.catalogData = this.$store.getters.CATALOGS_DATA[this.catalogId];
      this.catalogDataProcessed = this.processProductsData();
    }
  };

export default {
  name: 'Catalog',
  props: ['catalogId','sectionId','rankingFactorsFlattened'],
  data: function() {

    const headers = [
      {
        text: "#",
        value: 'index',
        width: 50
      },
      {
        text: 'Название',
        value: 'name',
        width: 300
      },
      {
        text: 'Раздел',
        value: 'sectionName',
        width: 150
      },
      {
        text: 'Производитель',
        value: 'manufacturerName',
        width: 150
      },
      {
        text: 'Продавец',
        value: 'sellerName',
        width: 150
      },
      {
        text: 'Цена',
        value: 'price'
      },
      {
        text: 'Ранг',
        value: 'rank'
      },
      {
        text: 'Ранг lg',  //десятичный
        value: 'rankWeighted'
      },
      {
        text: 'Ранг ln',  //натуральный
        value: 'rankLn'
      },
      {
        text: 'Ранг log2',  //по осн.2
        value: 'rankLog2'
      },
    ];


    this.rankingFactorsFlattened.forEach( (item) => {
      if(item.active) {
        headers.push({
          text: item.shortName,
          value: `factor_${item.id}`
        })
      }
    });

    return {
      catalogData: [],
      catalog:[],
      productsProcessing: false,
      catalogDataProcessed: [],
      tab: null,
      headers: headers
    }
  },
  beforeMount: loadCatalog,
  beforeUpdate: loadCatalog,
  methods: {
    setProcessing( val ) {
      this.productsProcessing = val;
    },
    processProductsData() {
      this.setProcessing(true);
      let result = [];
      if(this.catalogId) {
        console.log('start proc');

        let initialData = this.catalogData;
        if(this.sectionId !== undefined) {
          console.log('section',this.sectionId);
          initialData = initialData.filter( item => item.sectionId === this.sectionId);
        }
        
        initialData.forEach((product) => {
          product.manufacturer = this.$store.getters.MANUFACTURERS.find(element => element.id == product.manufacturerId ? element : undefined);
          product.seller = this.$store.getters.SELLERS.find(element => element.id == product.sellerId ? element : undefined);
          product.section = this.catalog.sections.find( item => item.id === product.sectionId);
          let rank = 0;

          const productProcessed = {
            'index': null,
            'id': product.id,
            'name': product.name,
            'url': product.url,
            'price': parseInt(product.price),
            'sellerName': product.seller ? product.seller.name : '',
            'manufacturerName': product.manufacturer ? product.manufacturer.name : '',
            'sectionName': product.section ? product.section.name : ''
          };
          
          if( product.price > 1000 ) {
            this.rankingFactorsFlattened.forEach( (factor) => {
              let total = 0;
              if(factor.active) {
                let factorValue = factor.getValue(product);
                total = factorValue * factor.weight;
                rank += total;
              }
              productProcessed['factor_' + factor.id] = total;
            });
          }
          productProcessed.rank = rank;
          productProcessed.rankWeighted = Math.log10(rank) / Math.log10(product.price);
          productProcessed.rankLn = Math.log(rank) / Math.log(product.price);
          productProcessed.rankLog2 = Math.log2(rank) / Math.log2(product.price);
          
          result.push(productProcessed);
        });

        result.sort((a, b) => {
          if(a.rankWeighted == b.rankWeighted) {
            return a.price == b.price ? 0 : (a.price > b.price ? 1 : -1);
          } else {
            return a.rankWeighted < b.rankWeighted ? 1 : -1;
          }
          
        });
        result = result.map( (item, index) => {
          let itemIndexed = item;
          itemIndexed.index = index + 1;
          return itemIndexed;
        } ); 

        console.log('end proc');

      }
      this.setProcessing(false);
      return result;
    }
  },
  
  watch: {
    catalogId: {
      immediate: true,
      handler: function() {
        if(this.catalogId !== undefined) {
            console.log('catalogId changed',this.catalogId);
            this.productsProcessing = true;
            this.catalogDataProcessed = this.processProductsData();
            this.productsProcessing = false;
        }
      }
    },
    sectionId: {
      immediate: true,
      handler: function() {
        if(this.catalogId !== undefined) {
            console.log('sectionId changed',this.catalogId);
            this.productsProcessing = true;
            this.catalogDataProcessed = this.processProductsData();
            this.productsProcessing = false;
        }
      }
    },
    rankingFactorsFlattened: {
      immediate: true,
      handler: function() {
        if(this.catalogId !== undefined) {
          this.catalogDataProcessed = this.processProductsData();
        }
      }
    }
  }
  
  
}
</script>

<style scoped>
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
  .v-data-footer__select {
    display: none!important;;
  }
  .container {
    margin-top: 25px;
    height: calc(100vh - 164px);
    overflow: auto;
  }
</style>