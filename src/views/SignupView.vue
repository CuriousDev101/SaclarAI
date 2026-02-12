<script setup lang="ts">

</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <form @submit.prevent class="fieldset bg-base-100 border-base-300 rounded-box w-xs border gap-5 p-4">
        <fieldset class="fieldset">
          <label class="label">Email</label>
          <input type="email" class="input validator outline-0" placeholder="Email" required />
          <p class="validator-hint hidden">Required</p>
        </fieldset>

        <label class="fieldset">
          <span class="label">Password</span>
          <input type="password" class="input validator outline-0" placeholder="Password" required />
          <span class="validator-hint hidden">Required</span>
        </label>

        <button class="btn mt-4" type="submit">Sign Up</button>
      </form>
    </div>
  </div>
</template>
