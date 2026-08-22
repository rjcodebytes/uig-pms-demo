@extends('initiator.layout.app')

@section('content')

<div class="pagetitle">
    <h1>PROCUREMENT</h1>
</div>

<div class="pagetitle">
    <nav>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="{{ url('initiator/dashboard')}}">Home</a></li>
        <li class="breadcrumb-item active"><a href="{{ url('initiator/procurement')}}">Procurement</a></li>
        <li class="breadcrumb-item active"><a href="#">Create Procurement</a></li>
      </ol>
    </nav>
  </div>

<div class="container">

    <section class="section d-flex flex-column align-items-center justify-content-center py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 col-md-8 d-flex flex-column align-items-center justify-content-center">
            <div class="card mb-3">
                <div class="card-body">

                    <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Create a Procurement</h5>
                    <p class="text-center small">Enter procurement details to create an procurement</p>
                    </div>

                    <form class="row g-3" action="{{ route('document.upload') }}" method="post" enctype="multipart/form-data">
                        {{ csrf_field() }}

                        <div class="col-12">
                            <label for="doc_title" class="form-label">Document Title*</label>
                            <input type="text" name="doc_title" class="form-control" required>
                        </div>

                        <div class="col-12">
                            <label for="doc_desc" class="form-label">Description*</label>
                            <textarea rows="5"  class="form-control" name="doc_desc" required></textarea>
                        </div>

                        <!-- Purchase Type -->
                        <div class="my-3">
                            <label for="purchase_type" class="form-label">Purchase Type*</label>
                            <select class="form-select" id="purchase_type" name="purchase_type" onchange="updateDescription()">
                                <option selected disabled>Select Purchase Type</option>
                                @foreach($purchase_types as $purchase_type)
                                    <option value="{{ $purchase_type->id }}" data-description="{{ $purchase_type->description }}" estimated-cost="{{ $purchase_type->estimated_cost }}">{{ $purchase_type->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <!-- Description -->
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3" disabled></textarea>
                        </div>

                        <!-- Estimated Cost -->
                        <div class="mb-3">
                            <label for="estimated-cost" class="form-label">Estimated Cost</label>
                            <input type="text" class="form-control" id="estimated-cost" disabled></input>
                        </div>

                        <div class="col-12">
                            <label for="document" class="form-label">Upload Document (PDF)*</label>
                            <input type="file" class="form-control" name="document" accept="application/pdf" required>
                        </div>

                        <div class="d-flex justify-content-center align-items-center mt-4">
                            <div class="col-3">
                                <button type="submit" class="btn btn-primary w-100">Upload Document</button>
                            </div>
                            <div class="col-3 ms-3">
                                <a href="{{ url('initiator/procurement') }}" class="btn btn-secondary w-100">Cancel</a>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
          </div>
        </div>
      </div>

    </section>

</div>

<script>
    function updateDescription() {
        const purchaseTypeSelect = document.getElementById('purchase_type');
        const descriptionField = document.getElementById('description');
        const costField = document.getElementById('estimated-cost');

        // Get the selected option
        const selectedOption = purchaseTypeSelect.options[purchaseTypeSelect.selectedIndex];

        // Set the description based on the selected option's data-description attribute
        descriptionField.value = selectedOption.getAttribute('data-description') || '';
        costField.value = selectedOption.getAttribute('estimated-cost') || '';
    }
</script>

@endsection

