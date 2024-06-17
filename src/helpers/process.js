import {getMapping, getNewProcessOptions} from '@/api';
import {computed, reactive, ref} from 'vue';

export function getOptions() {
  const options = reactive({
    goods: [],
    units: []
  });
  const units = computed(() => {
    return function(id) {
      if(id && options.units[id]) {
        return options.units[id];
      }
      return [];
    };
  });
  const goods = computed(() => {
    return function(type) {
      if(type && options.goods[type]) {
        return options.goods[type];
      }
      return [];
    };
  });
  const unitConversionMapping = ref({});
  const goodsDefaultUnitMapping = ref({});
  function update() {
    Promise.all([
      getNewProcessOptions(),
      getMapping('unit,goods')
    ]).then(res => {
      const [rep, { unit , goods }] = res;
      let map = {};
      for(const id in unit) {
        map[id] = unit[id].conversion;
      }
      unitConversionMapping.value = map;
      map = {};
      for(const id in goods) {
        map[id] = goods[id].baseUnitId;
      }
      goodsDefaultUnitMapping.value = map;
      options.goods = rep.goods;
      options.units = rep.units;
      options.specs = rep.specs;
    });
  }
  update();
  return {
    units,
    goods,
    goodsDefaultUnitMapping,
    unitConversionMapping,
    update
  };
}

