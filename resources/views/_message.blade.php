@if (!empty(session('success')))
  <div class="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
  <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
<dotlottie-player src="https://lottie.host/b2106acb-574f-4c45-a88c-acb567b9368d/vdlbBHQQKF.lottie" background="transparent" speed="1" style="width: 40px; height: 40px" loop autoplay></dotlottie-player>
  <p class="mb-0 ms-2">{{ session('success') }}</p>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
@endif

@if (!empty(session('error')))
<div class="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
    <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
    <dotlottie-player src="https://lottie.host/a5d00a6a-4638-487a-8022-763b9b283696/UChkocIXej.lottie" background="transparent" speed="1" style="width: 40px; height: 40px;" loop autoplay></dotlottie-player>
    <p class="mb-0 ms-2">{{ session('error') }}</p>
    <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
@endif
