<template>
  <v-card>
    <v-card-title>{{ label }}</v-card-title>
    <v-divider />
    <v-card-text class="address-card__body">
      <div class="address-card__name">{{ address.name }}</div>
      <div class="address-card__row">
        {{ address.house }}, {{ address.street }} <br />
        {{ address.area }}, {{ address.district }}<br />
        {{ address.division }} - {{ address.zip }}<br />
      </div>
      <div class="address-card__row">
        <div class="address-card__row-title">Mobile</div>
        <div class="address-card__row-content">{{ address.mobile }}</div>
      </div>
      <div v-if="address.email" class="address-card__row">
        <div class="address-card__row-title">Email</div>
        <div class="address-card__row-content">{{ address.email }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AddressCard',
  props: {
    address: {
      type: Object,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
  },
};
</script>

<style scoped lang="scss">
.address-card__body {
  font-size: 15px;
  line-height: 18px;
}
.address-card__name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 1.125rem;
}
.address-card__row + .address-card__row {
  margin-top: 0.75rem;
}
.address-card__row-title {
  font-size: 13px;
  color: #6c757d;
  font-weight: 700;
}
</style>
