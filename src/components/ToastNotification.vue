<script>
export default {
  props: ["message", "shuffle"],
};
</script>

<template>
  <div class="toast toast-top toast-end pt-20 z-50">
    <div v-if="shuffle" class="alert alert-warning">
      <div>
        <span>Mengocok kartu yang dibuang kembali ke dek.</span>
      </div>
    </div>
    <div class="alert alert-info">
      <div>
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>
