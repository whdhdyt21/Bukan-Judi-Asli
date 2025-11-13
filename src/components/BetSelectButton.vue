<script>
export default {
  props: ["bets"],
  data() {
    return {
      value: this.$props.bets[0],
    };
  },
  methods: {
    changeValue() {
      const v = this.$refs.betValue.value;
      this.value = v;
      // emit raw value (string) so parent decides how to parse (numeric or text)
      this.$emit("change", v);
    },
  },
};
</script>

<template>
  <select
    class="select select-accent max-w-xs !outline-none"
    @change="changeValue"
    ref="betValue"
  >
    <option :key="bet" v-for="bet in bets" :value="bet">{{ bet }}</option>
  </select>
</template>
