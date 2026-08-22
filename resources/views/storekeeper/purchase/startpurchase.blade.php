@extends("storekeeper.layout.app")

@section("content")

<div class="pagetitle">
    <h3>PURCHASE REQUEST</h3>
</div>

<div class="pagetitle">
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{ url('storekeeper/dashboard')}}">Home</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('storekeeper/purchase')}}">Purchase Request</a></li>
      <li class="breadcrumb-item active"><a href="#">Start Purchase</a></li>
    </ol>
  </nav>
</div>

@include('_message')

<div class="container mt-4">
    <div class="card">
        <div class="card-header">
            <h4>Start Purchase Process</h4>
        </div>
        <div class="card-body">
            <form action="{{ url('/purchase-store/'.$document->doc_id) }}" method="POST" enctype="multipart/form-data">
                @csrf

                <!-- Purchase ID -->
                <div class="my-3">
                    <label for="purchase_id" class="form-label">Purchase ID*</label>
                    <input type="text" class="form-control" id="purchase_id" name="purchase_id" required>
                </div>

                <!-- Start Date and End Date -->
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="start_date" class="form-label">Start Date*</label>
                        <input
                            type="date"
                            class="form-control"
                            id="start_date"
                            name="start_date"
                            required
                            onchange="updateEndDateMin()"
                        >
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="end_date" class="form-label">End Date*</label>
                        <input
                            type="date"
                            class="form-control"
                            id="end_date"
                            name="end_date"
                            required
                        >
                    </div>
                </div>

                <!-- Document Upload -->
                <div class="mb-3">
                    <label for="documents" class="form-label">Document Upload</label>
                    <input type="file" class="form-control" id="document" name="document" accept="application/pdf">
                </div>

                <!-- Committee Assignment -->
                <div class="mb-3">
                    <label for="committee" class="form-label">Assign Committee</label>
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#assignCommitteeModal">
                            Assign Committee
                        </button>
                        <span>Available users will be listed below for committee selection.</span>
                    </div>
                </div>

                <!-- Committee Members -->
                <div id="selectedCommitteeMembers"></div>

                <!-- Start Purchase Button -->
                <div class="text-end">
                    <button type="submit" id="startPurchaseButton" class="btn btn-success" disabled>Start Purchase</button>
                </div>

            </form>
        </div>

        <!-- Modal for Committee Assignment -->
        <div class="modal fade" id="assignCommitteeModal" tabindex="-1" aria-labelledby="assignCommitteeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="assignCommitteeModalLabel">Assign Committee</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Select users from the list below to form the committee for the purchase:</p>
                        <ul class="list-group">
                            @foreach($users as $user)
                                <li class="list-group-item">
                                    <div class="form-check">
                                        <input
                                            class="form-check-input committee-checkbox"
                                            type="checkbox"
                                            value="{{ $user->id }}"
                                            id="user_{{ $user->id }}"
                                            onchange="updateCommitteeSelection()">
                                        <label class="form-check-label" for="user_{{ $user->id }}">
                                            {{ $user->name }} ({{ $user->roles->name }})
                                        </label>
                                    </div>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close" onclick="addCommitteeMembers()">Add Members</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // function addCommitteeMembers() {
    //     const selectedMembers = document.querySelectorAll('.committee-checkbox:checked');
    //     const selectedCommitteeContainer = document.getElementById('selectedCommitteeMembers');
    //     selectedCommitteeContainer.innerHTML = '';

    //     selectedMembers.forEach(member => {
    //         const input = document.createElement('input');
    //         input.type = 'hidden';
    //         input.name = 'committee_members[]';
    //         input.value = member.value;
    //         selectedCommitteeContainer.appendChild(input);
    //     });

    //     const checkboxes = document.querySelectorAll('.committee-checkbox');
    //     const selectedCommitteeMembers = document.getElementById('selectedCommitteeMembers');
    //     selectedCommitteeMembers.innerHTML = ''; // Clear the list

    //     // Add selected members to the display
    //     checkboxes.forEach(checkbox => {
    //         if (checkbox.checked) {
    //             const memberName = checkbox.nextElementSibling.textContent.trim();
    //             selectedCommitteeMembers.innerHTML += `<div>${memberName}</div>`;
    //         }
    //     });
    // }

    function addCommitteeMembers() {
    const selectedMembers = document.querySelectorAll('.committee-checkbox:checked');
    const selectedCommitteeContainer = document.getElementById('selectedCommitteeMembers');

    // Clear previously selected members
    selectedCommitteeContainer.innerHTML = '';

    selectedMembers.forEach(member => {
        // Create hidden input for form submission
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'committee_members[]'; // Array format
        input.value = member.value;
        selectedCommitteeContainer.appendChild(input);

        // Display selected member names
        const memberName = member.nextElementSibling.textContent.trim();
        const memberDiv = document.createElement('div');
        memberDiv.textContent = memberName;
        selectedCommitteeContainer.appendChild(memberDiv);
    });

    // Enable or disable Start Purchase button based on selection
    document.getElementById('startPurchaseButton').disabled = selectedMembers.length === 0;
    }
</script>

<script>
    function updateCommitteeSelection() {
        const checkboxes = document.querySelectorAll('.committee-checkbox');
        const startPurchaseButton = document.getElementById('startPurchaseButton');
        const selectedMembers = [];

        // Check if any checkbox is selected
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedMembers.push(checkbox.value);
            }
        });

        // Enable or disable the button based on selection
        startPurchaseButton.disabled = selectedMembers.length === 0;
    }
</script>

<script>
    // Function to set minimum dates dynamically
    function setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        const startDateInput = document.getElementById('start_date');
        const endDateInput = document.getElementById('end_date');

        // Set the minimum date for both inputs
        startDateInput.min = today;
        endDateInput.min = today;
    }

    // Function to update the end date's minimum based on the selected start date
    function updateEndDateMin() {
        const startDateInput = document.getElementById('start_date');
        const endDateInput = document.getElementById('end_date');

        // Set the end date's minimum to the selected start date
        endDateInput.min = startDateInput.value;
    }

    // Initialize minimum dates on page load
    document.addEventListener('DOMContentLoaded', setMinDates);
</script>


@endsection
