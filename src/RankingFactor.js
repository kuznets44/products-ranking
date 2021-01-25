export default class RankingFactor {
  id = 0;
  name = '';
  weight = 100;
  paramsComponent = '';
  active = true;
  getValue = new Function();
  params = [];
  shortName = '';

  constructor(id,name,shortName,weight,paramsComponent,getValue,params = [],active = true) {
    this.id = id;
    this.name = name;
    this.shortName = shortName;
    this.weight = weight;
    this.getValue = getValue;
    this.active = active;
    this.paramsComponent = paramsComponent;
    this.params = params;
  }
}

/*     /*      
      rankingFactors: [
        {
          id: 456,
          name: 'Показатели товара',
          icon: 'settings',
          expanded: true,
          factors: [
            new RankingFactor(
              275866,
              'Количество фотографий',
              'К-во фото',
              100,
              'FactorPhotosCount',
              function(product) {
                switch(product['PHOTOS_COUNT']) {
                case 1: 
                case 2: 
                    return this.params[0];
                case 3:
                    return this.params[1];
                default:
                    return this.params[2];
                }
              },[
                0,0.5,1
              ]
            ),
            new RankingFactor(
              275867,
              'Наличие описания',
              'Описание',
              100,
              'FactorDetailText',
              function(product) {
                if(product['DETAIL_TEXT'].length > 0) {
                  return this.params[0]
                }
                return 0;
              },[0.5]
            ),
            new RankingFactor(
              275868,
              'Заполненность характеристик',
              'Характ.',
              100,
              '',
              function(product) {
                if(product['TOTAL_CHARS']) {
                  return Math.round(product['TOTAL_CHARS'] / product['FILLED_CHARS'],1);
                }
                return 0;
              },[]
            ),
            new RankingFactor(
              275869,
              'Отзывы о товаре',
              'Отз.',
              100,
              'FactorReviews',
              function(product) {
                let hasLowerThan3 = false;
                let hasHigherThan3 = false;
                let reviewsCount = product['REVIEWS'].length;

                product['REVIEWS'].forEach((review) => {
                  if(review['RATING'] < 3) {
                    hasLowerThan3 = true;
                  }
                  if(review['RATING'] > 3) {
                    hasHigherThan3 = true;
                  }
                });

                let result = 0;

                if(reviewsCount > 0)  result = this.params[0];
                if(hasLowerThan3)     result += this.params[1];
                if(hasHigherThan3)    result += this.params[2];
                if(reviewsCount > 5)  result += this.params[3];

                return result;
              },[0.75,-0.5,0.25,1]
            ),
            new RankingFactor(
              275870,
              'Отзывы о бренде товаре',
              'Отз. о бренде',
              100,
              'FactorReviews',
              function(product) {
                let hasLowerThan3 = false;
                let hasHigherThan3 = false;
                let reviewsCount = product['BRAND_REVIEWS'].length;

                product['BRAND_REVIEWS'].forEach((review) => {
                  if(review['RATING'] < 3) {
                    hasLowerThan3 = true;
                  }
                  if(review['RATING'] > 3) {
                    hasHigherThan3 = true;
                  }
                });

                let result = 0;

                if(reviewsCount > 0)  result = this.params[0];
                if(hasLowerThan3)     result += this.params[1];
                if(hasHigherThan3)    result += this.params[2];
                if(reviewsCount > 5)  result += this.params[3];

                return result;
              },[0.75,-0.5,0.25,1]
            ),
            new RankingFactor(
              275871,
              'Наличие скидки',
              'Скидка',
              100,
              'FactorSale',
              function(product) {

                if(product['PRICE'] < product['OLD_PRICE']) {
                  return this.params[0];
                } else {
                  return 0;
                }

              },[0.5]
            ),
            new RankingFactor(
              275872,
              'Баллы от Mebel.ru',
              'Баллы от Mebel.ru',
              100,
              '',
              function(product) {

                if(product['MEBELRU_POINTS']) {
                  return product['MEBELRU_POINTS'];
                } else {
                  return 0;
                }

              },[]
            ),
          ]
        },
        {
          id: 457,
          name: 'Показатели продавца',
          icon: 'settings',
          expanded: true,
          factors: [
            new RankingFactor(
              275873,
              'Отзывы продавце',
              'Отз. о продавце',
              100,
              'FactorReviews',
              function(product) {
                let hasLowerThan3 = false;
                let hasHigherThan3 = false;
                let reviewsCount = product['SELLER']['REVIEWS'].length;

                product['SELLER']['REVIEWS'].forEach((review) => {
                  if(review['RATING'] < 3) {
                    hasLowerThan3 = true;
                  }
                  if(review['RATING'] > 3) {
                    hasHigherThan3 = true;
                  }
                });

                let result = 0;

                if(reviewsCount > 0)  result = this.params[0];
                if(hasLowerThan3)     result += this.params[1];
                if(hasHigherThan3)    result += this.params[2];
                if(reviewsCount > 5)  result += this.params[3];

                return result;
              },[0.25,-0.25,0.25,0]
            ),
            new RankingFactor(
              275875,
              'Наличие розничной точки',
              'Розн. точка',
              100,
              'FactorRetailPoint',
              function(product) {
                if(product['SELLER']['HAS_RETAIL_POINT']) {
                  return this.params[0];
                 } else {
                  return 0;
                 }              
              },[0.5]
            ),
            new RankingFactor(
              275876,
              'Заполненность профиля',
              'Заполн. проф.',
              100,
              'FactorProfile',
              function(product) {
                if(product['SELLER']['HAS_PROFILE_FILLED']) {
                  return this.params[0];
                 } else {
                  return 0;
                 }              
              },[-0.5]
            ),
            new RankingFactor(
              275882,
              'Наличие логотипа и ссылки на Mebel.ru',
              'Ссылка на mebel.ru',
              100,
              'FactorLogoLink',
              function(product) {
                if(product['SELLER']['HAS_MEBELRU_LINK']) {
                  return this.params[0];
                 } else {
                  return 0;
                 }              
              },[1]
            ),
            new RankingFactor(
              275877,
              'Наличие акций',
              'Акции',
              100,
              'FactorSellerActions',
              function(product) {
                let result = product['SELLER']['ACTIONS'].length * this.params[0];
                if(result > 0) {
                  return Math.max(result,this.params[1]);             
                } else {
                  return 0;
                }
              },[0.1,0.5]
            ),
            new RankingFactor(
              275881,
              'Наличие статей от продавца',
              'Статьи',
              100,
              'FactorSellerArticles',
              function(product) {
                let result = product['SELLER']['ARTICLES'].length * this.params[0];
                if(result > 0) {
                  return Math.max(result,this.params[1]);             
                } else {
                  return 0;
                }
              },[0.1,1]
            ),
            new RankingFactor(
              275879,
              'Ручная корректировка',
              'Ручн. корр.',
              100,
              '',
              function(product) {
                if(product['SELLER']['RANKING_POINTS']) {
                  return product['SELLER']['RANKING_POINTS'];
                } else {
                  return 0;
                }
              },[]
            ),
          ]
        }
      ],*/