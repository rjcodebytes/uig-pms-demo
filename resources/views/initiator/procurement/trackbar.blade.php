<!-- Document Progressbar -->
<style>
    .alert {
   position: absolute; /* Positioning the alert */
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   visibility: hidden;
 }

 .approver{
    background: transparent;
    width: 80px;
 }
</style>
<div class="card">
    <div class="container mb-3" >
        <div class="progress-container">
            <div class="approver">
                <div class="approver-circle pending">
                    <div class="alert alert-success show d-flex align-items-center" role="alert"
                        id="approvedAlertHOD">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/b2106acb-574f-4c45-a88c-acb567b9368d/vdlbBHQQKF.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px" loop
                            autoplay></dotlottie-player>
                    </div>

                    <div class="alert alert-pending show d-flex align-items-center" role="alert"
                        id="pendingAlertHOD">
                        <script
                            src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
                        <dotlottie-player
                            src="https://lottie.host/27f38319-d970-46f7-b3f3-f465d1986b01/SaQo0nVHfb.json"
                            background="##FFFFFF" speed="1" style="width: 50px; height: 50px" loop autoplay>
                        </dotlottie-player>
                    </div>

                    <div class="alert alert-danger show d-flex align-items-center" role="alert"
                        id="rejectAlertHOD">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/a5d00a6a-4638-487a-8022-763b9b283696/UChkocIXej.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px;" loop
                            autoplay></dotlottie-player>
                    </div>
                </div>
                <div class="approver-label" id="Head Of Department">HOD</div>
            </div>

            <div class="line" id="lineHODtoOS"></div>

            <div class="approver">
                <div class="approver-circle pending">
                    <div class="alert alert-success show d-flex align-items-center" role="alert"
                        id="approvedAlertOS">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/b2106acb-574f-4c45-a88c-acb567b9368d/vdlbBHQQKF.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px" loop
                            autoplay></dotlottie-player>
                    </div>

                    <div class="alert alert-pending show d-flex align-items-center" role="alert"
                        id="pendingAlertOS">
                        <script
                            src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
                        <dotlottie-player
                            src="https://lottie.host/27f38319-d970-46f7-b3f3-f465d1986b01/SaQo0nVHfb.json"
                            background="##FFFFFF" speed="1" style="width: 50px; height: 50px" loop autoplay>
                        </dotlottie-player>
                    </div>

                    <div class="alert alert-danger show d-flex align-items-center" role="alert"
                        id="rejectAlertOS">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/a5d00a6a-4638-487a-8022-763b9b283696/UChkocIXej.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px;" loop
                            autoplay></dotlottie-player>
                    </div>
                </div>
                <div class="approver-label" id="Office Superintendent">OS</div>
            </div>

            <div class="line" id="lineOStoRegistrar"></div>

            <div class="approver">
                <div class="approver-circle pending">
                    <div class="alert alert-success show d-flex align-items-center" role="alert"
                        id="approvedAlertRegistrar" Registrar>
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/b2106acb-574f-4c45-a88c-acb567b9368d/vdlbBHQQKF.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px" loop
                            autoplay></dotlottie-player>
                    </div>

                    <div class="alert alert-pending show d-flex align-items-center" role="alert"
                        id="pendingAlertRegistrar">
                        <script
                            src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
                        <dotlottie-player
                            src="https://lottie.host/27f38319-d970-46f7-b3f3-f465d1986b01/SaQo0nVHfb.json"
                            background="##FFFFFF" speed="1" style="width: 50px; height: 50px" loop autoplay>
                        </dotlottie-player>
                    </div>

                    <div class="alert alert-danger show d-flex align-items-center" role="alert"
                        id="rejectAlertRegistrar">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/a5d00a6a-4638-487a-8022-763b9b283696/UChkocIXej.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px;" loop
                            autoplay></dotlottie-player>
                    </div>
                </div>
                <div class="approver-label" id="Registrar">Registrar</div>
            </div>

            <div class="line" id="lineRegistrartoPrincipal"></div>

            <div class="approver">
                <div class="approver-circle pending">
                    <div class="alert alert-success show d-flex align-items-center" role="alert"
                        id="approvedAlertPrincipal">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/b2106acb-574f-4c45-a88c-acb567b9368d/vdlbBHQQKF.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px" loop
                            autoplay></dotlottie-player>
                    </div>

                    <div class="alert alert-pending show d-flex align-items-center" role="alert"
                        id="pendingAlertPrincipal">
                        <script
                            src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
                        <dotlottie-player
                            src="https://lottie.host/27f38319-d970-46f7-b3f3-f465d1986b01/SaQo0nVHfb.json"
                            background="##FFFFFF" speed="1" style="width: 50px; height: 50px" loop autoplay>
                        </dotlottie-player>
                    </div>

                    <div class="alert alert-danger show d-flex align-items-center" role="alert"
                        id="rejectAlertPrincipal">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/a5d00a6a-4638-487a-8022-763b9b283696/UChkocIXej.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px;" loop
                            autoplay></dotlottie-player>
                    </div>
                </div>
                <div class="approver-label" id="Principal">Principal</div>
            </div>

            <div class="line" id="linePrincipaltoStoreIncharge"></div>

            <div class="approver">
                <div class="approver-circle pending">
                    <div class="alert alert-success show d-flex align-items-center" role="alert"
                        id="approvedAlertStoreIncharge">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/b2106acb-574f-4c45-a88c-acb567b9368d/vdlbBHQQKF.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px" loop
                            autoplay></dotlottie-player>
                    </div>

                    <div class="alert alert-pending show d-flex align-items-center" role="alert"
                        id="pendingAlertStoreIncharge">
                        <script
                            src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
                        <dotlottie-player
                            src="https://lottie.host/27f38319-d970-46f7-b3f3-f465d1986b01/SaQo0nVHfb.json"
                            background="##FFFFFF" speed="1" style="width: 50px; height: 50px" loop autoplay>
                        </dotlottie-player>
                    </div>

                    <div class="alert alert-danger show d-flex align-items-center" role="alert"
                        id="rejectAlertStoreIncharge">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/a5d00a6a-4638-487a-8022-763b9b283696/UChkocIXej.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px;" loop
                            autoplay></dotlottie-player>
                    </div>
                </div>
                <div class="approver-label" id="Store Incharge">StoreIncharge</div>
            </div>

            <div class="line"></div>

            <div class="approver">
                <div class="approver-circle pending">
                    <div class="alert alert-success show d-flex align-items-center" role="alert"
                        id="approvedAlertStoreKeeper">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/b2106acb-574f-4c45-a88c-acb567b9368d/vdlbBHQQKF.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px" loop
                            autoplay></dotlottie-player>
                    </div>

                    <div class="alert alert-pending show d-flex align-items-center" role="alert"
                        id="pendingAlertStoreKeeper">
                        <script
                            src="https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js"></script>
                        <dotlottie-player
                            src="https://lottie.host/27f38319-d970-46f7-b3f3-f465d1986b01/SaQo0nVHfb.json"
                            background="##FFFFFF" speed="1" style="width: 50px; height: 50px" loop autoplay>
                        </dotlottie-player>
                    </div>

                    <div class="alert alert-danger show d-flex align-items-center" role="alert"
                        id="rejectAlertStoreKeeper">
                        <script
                            src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
                            type="module"></script>
                        <dotlottie-player
                            src="https://lottie.host/a5d00a6a-4638-487a-8022-763b9b283696/UChkocIXej.lottie"
                            background="transparent" speed="1" style="width: 50px; height: 50px;" loop
                            autoplay></dotlottie-player>
                    </div>
                </div>
                <div class="approver-label" id="Store Keeper">StoreKeeper</div>
            </div>
        </div>

    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>


    <script>

        function updateProgressBar(workflows) {
            $('.approver').each(function (index) {
                const approverId = $(this).find('.approver-label').attr('id');
                const circle = $(this).find('.approver-circle');
                const line = $('.line').eq(index - 1);

                // Hide all alerts initially
                $(this).find('.alert').css('visibility', 'hidden');

                // Find matching workflow data for this approver by ID
                const approverData = workflowData.find(item => item.position == approverId);

                if (approverData) {
                    // Remove previous status classes
                    circle.removeClass('approved pending rejected');

                    // Add the class based on status and update visuals
                    switch (approverData.status) {
                        case 'Approved':
                            circle.addClass('approved');
                            $(this).find(`#approvedAlert${approverId}`).css('visibility', 'visible'); // Show approved alert
                            if (line.length) line.css('background-color', 'green'); // Set line to green
                            break;
                        case 'Pending':
                            circle.addClass('pending');
                            $(this).find(`#pendingAlert${approverId}`).css('visibility', 'visible'); // Show pending alert
                            if (line.length) line.css('background-color', 'orange'); // Set line to orange
                            break;
                        case 'Rejected':
                            circle.addClass('rejected');
                            $(this).find(`#rejectAlert${approverId}`).css('visibility', 'visible'); // Show rejected alert
                            if (line.length) line.css('background-color', 'red'); // Set line to red
                            break;
                        default:
                            console.warn(`Unknown status for position ID ${approverId}: ${approverData.status}`);
                    }
                } else {
                    console.warn(`No workflow data found for position ID: ${approverId}`);
                }
            });
        }

        // Function to update Lottie icon visibility based on status
        function updateAlertVisibility() {
            $('.approver').each(function (index) {
                const circle = $(this).find('.approver-circle');

                // Hide all alerts initially
                $(this).find('.alert').css('visibility', 'hidden');

                // Check the class of the status circle and show appropriate alert
                if (circle.hasClass('approved')) {
                    $(this).find('#approvedAlert' + $(this).find('.approver-label').text()).css('visibility', 'visible'); // Show approved alert
                    if (index > 0) { // Change line color only if it's not the first approver
                        $('.line').eq(index - 1).css('background-color', 'green'); // Change line color to green for approved
                    }
                } else if (circle.hasClass('pending')) {
                    $(this).find('#pendingAlert' + $(this).find('.approver-label').text()).css('visibility', 'visible'); // Show pending alert
                    if (index > 0) { // Change line color only if it's not the first approver
                        $('.line').eq(index - 1).css('background-color', 'orange'); // Change line color to orange for pending
                    }
                } else if (circle.hasClass('rejected')) {
                    $(this).find('#rejectAlert' + $(this).find('.approver-label').text()).css('visibility', 'visible'); // Show rejected alert
                    if (index > 0) { // Change line color only if it's not the first approver
                        $('.line').eq(index - 1).css('background-color', 'red'); // Change line color to red for rejected
                    }
                }
            });
        }


    </script>
</div>
