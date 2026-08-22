@extends("storekeeper.layout.app")

@section('content')
<div class="pagetitle">
  <h1>CREATED PURCHASE</h1>
</div>

<div class="pagetitle">
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{ url('storekeeper/dashboard')}}">Home</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('storekeeper/purchaseview')}}">Purchase Request</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('storekeeper/purchase/viewpurchaserequest')}}">View Purchase
          Request</a></li>
    </ol>
  </nav>
</div>

@include('_message')

<div class="card">
  <div class="card-body">
    <h5 class="card-title">Purchase Request Information</h5>
    <table class="table table-bordered">
      <tr>
        <th>Purchase ID</th>
        <td>{{ $purchase->purchase_id }}</td>
      </tr>
      <tr>
        <th>Document Title</th>
        <td>{{ $document->doc_title }}</td>
      </tr>
      <tr>
        <th>Purchase Type</th>
        <td>{{ $purchase_type->name }}</td>
      </tr>
      <tr>
        <th>Description</th>
        <td>{{ $purchase_type->description }}</td>
      </tr>
      <tr>
        <th>Estimated Cost</th>
        <td>Rs. {{ $purchase_type->estimated_cost }}</td>
      </tr>
      <tr>
        <th>Start Date</th>
        <td>{{ $purchase->start_date->format('d/m/Y') }}</td>
      </tr>
      <tr>
        <th>End Date</th>
        <td>{{ $purchase->end_date->format('d/m/Y') }}</td>
      </tr>
      <tr>
        <th>Document</th>
        <td>
          <a type="button" href="{{ route('purchase.view', ['id' => $purchase->purchase_id]) }}" target="_blank"
            class="btn btn-primary btn-md">
            <i class="ri-file-text-fill"></i> View Document
          </a>
        </td>
      </tr>
    </table>
  </div>
</div>

<div class="card mt-4">
  <div class="card-body">
    <h5 class="card-title">Purchase Committee Members</h5>
  @if($committee->isEmpty())
    <p>No committee members assigned to this purchase.</p>
  @else
  <table class="table table-bordered">
    <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
    </thead>
    <tbody>
    @foreach($committee as $member)
    <tr>
      <td>{{ $member->name }}</td>
      <td>{{ $member->email }}</td>
    </tr>
  @endforeach
    </tbody>
  </table>
@endif
  </div>
</div>

@if($purchase->status === "Pending")
    <div class="mt-4 mb-2 ms-3">
      <div class="col-3 ">
        <a class="btn btn-primary" onclick="toggleSection()">Action</a>
      </div>

      <!-- Hidden Section -->
      <div id="actionSection" class="card-body m-3" style="display: none;">
        <div class="card p-3">
          <h5 class="card-title p-0">Select Status</h5>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="status" id="complete" value="Complete"
              onclick="showVendorDetails()">
            <label class="form-check-label" for="complete">Complete</label>
          </div>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="status" id="notComplete" value="Not Complete"
              onclick="showRemarkOnly()">
            <label class="form-check-label" for="notComplete">Not Complete</label>
          </div>
        </div>

        <!-- Hidden Section for Vendor Details -->
        <div id="vendorDetailsSection" class="mt-3" style="display: none;">
          <div class="card p-3">
            <h5>Vendor Details</h5>
            <form id="vendorDetailsForm" action="{{ url('/vendor-details-store/'.$purchase->purchase_id) }}" method="post" enctype="multipart/form-data">
                @csrf

                <input type="hidden" name="status" id="statusHidden">

                <div id="completeFormFields">
                    <div class="mb-3">
                      <label for="purchaseOrder" class="form-label">Purchase Order</label>
                      <input type="text" class="form-control" id="purchaseOrder" name="purchaseOrder"
                        placeholder="Enter Purchase Order">
                    </div>
                    <div class="mb-3">
                      <label for="vendorName" class="form-label">Vendor Name</label>
                      <input type="text" class="form-control" id="vendorName" name="vendorName" placeholder="Enter Vendor Name"
                    >
                    </div>
                    <div class="mb-3">
                      <label for="paymentDetails" class="form-label">Payment Details</label>
                      <input type="text" class="form-control" id="paymentDetails" name="paymentDetails"
                        placeholder="Enter Payment Details">
                    </div>
                    <div class="mb-3">
                      <label for="contractDocument" class="form-label">Contract Document</label>
                      <input type="file" class="form-control" id="contractDocument" name="contractDocument" accept="application/pdf">
                    </div>
                </div>

                <div id="remarkSection" style="display: none;">
                    <div class="mb-3">
                      <label for="remark" class="form-label">Remark</label>
                      <textarea class="form-control" id="remark" name="remark" rows="3" placeholder="Enter Remark"></textarea>
                    </div>
                </div>

                <button type="submit" class="btn btn-success">Close Purchase</button>
            </form>
          </div>
        </div>

      </div>
    </div>
@else
<div class="card">
    <div class="card-body">
      <h5 class="card-title">Purchase Request Information</h5>
      <table class="table table-bordered">
        <tr>
          <th>Purchase order</th>
          <td>{{ $purchase->purchase_order }}</td>
        </tr>
        <tr>
          <th>Vendor Name</th>
          <td>{{ $purchase->vendor_name }}</td>
        </tr>
        <tr>
          <th>Payment Details</th>
          <td>{{ $purchase->payment_details }}</td>
        </tr>
        <tr>
          <th>Contract Document</th>
          <td>
            <a type="button" href="{{ route('contract.view', ['id' => $purchase->purchase_id]) }}" target="_blank"
              class="btn btn-primary btn-md">
              <i class="ri-file-text-fill"></i> View Document
            </a>
          </td>
        </tr>
        <tr>
            <th>Remark</th>
            <td>{{ $purchase->remark }}</td>
        </tr>
        <tr>
            <th>Date</th>
            <td>{{ $purchase->updated_at->format('d/m/Y') }}</td>
          </tr>
      </table>
    </div>
  </div>

@endif

<div class="col-3 ms-3">
  <a href="{{ url()->previous() }}" class="btn btn-secondary">Back To List</a>
</div>

<script>
    function toggleSection() {
      const actionSection = document.getElementById('actionSection');
      actionSection.style.display = actionSection.style.display === 'none' ? 'block' : 'none';
    }

    function showVendorDetails() {
        document.getElementById("vendorDetailsSection").style.display = "block";
        document.getElementById("completeFormFields").style.display = "block";
        document.getElementById("remarkSection").style.display = "block";
        document.getElementById("statusHidden").value = "Complete";

        document.getElementById("purchaseOrder").setAttribute("required", "required");
        document.getElementById("vendorName").setAttribute("required", "required");
        document.getElementById("paymentDetails").setAttribute("required", "required");
        document.getElementById("contractDocument").setAttribute("required", "required");
    }

    function showRemarkOnly() {
        document.getElementById("vendorDetailsSection").style.display = "block";
        document.getElementById("completeFormFields").style.display = "none";
        document.getElementById("remarkSection").style.display = "block";
        document.getElementById("statusHidden").value = "Not Complete";

        document.getElementById("purchaseOrder").removeAttribute("required");
        document.getElementById("vendorName").removeAttribute("required");
        document.getElementById("paymentDetails").removeAttribute("required");
        document.getElementById("contractDocument").removeAttribute("required");
    }
</script>

@endsection
