@extends("approver.layout.app")

@section('content')

<div class="pagetitle">
  <h1>Purchase Type</h1>
</div>

<section class="section">
  <div class="row">
    <div class="col-lg-8">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Edit Purchase Type</h5>

          <form action="" method="post">
            {{ csrf_field() }}

            <!-- Name Input -->
            <div class="row mb-3">
              <label for="name" class="col-md-2 col-form-label">Name</label>
              <div class="col-md-10">
                <input style="transition:.3s" type="text" name="ptypename" value="{{ $getRecord->name }}" required
                  class="form-control" id="name">
              </div>
            </div>

            <!-- Description Input -->
            <div class="row mb-3">
              <label for="description" class="col-md-2 col-form-label">Description</label>
              <div class="col-md-10">
                <textarea style="transition:.3s" name="description" class="form-control" id="description"
                  rows="3">{{ $getRecord->description }}</textarea>
              </div>
            </div>

            <!-- Estimated Cost Input -->
            <div class="row mb-3">
              <label for="estimated_cost" class="col-md-2 col-form-label">Estimated Cost</label>
              <div class="col-md-10">
                <input style="transition:.3s" type="text" name="estimated_cost" value="{{ $getRecord->estimated_cost }}"
                  required placeholder="e.g., 5000 - 50000" class="form-control" id="estimated_cost">
              </div>
            </div>

            <div class="text-center mt-5">
              <button type="submit" class="btn btn-primary">Update</button>
              <a type="cancel" href="{{ url()->previous() }}" class="btn btn-secondary">Cancel</a>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</section>

@endsection