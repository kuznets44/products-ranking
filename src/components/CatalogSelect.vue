<template>
  <md-field>
    <label for="font">Каталог: </label>
    <md-select name="iblocks" id="iblocks" md-dense>
      <md-option  v-for="(item,key) in items"
                  :key="key"
                  value="item.id">{{ item.name }}</md-option>
    </md-select>
  </md-field>
</template>

<script>
  export default {
    name: 'CatalogSelect',
    props: ['items']
  }
</script>