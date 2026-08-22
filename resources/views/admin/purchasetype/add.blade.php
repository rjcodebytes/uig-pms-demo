@extends("admin.layout.app")

@section('content')

<div class="pagetitle">
  <h1>Purchase Type</h1>
</div>

<section class="section">
  <div class="row">
    <div class="col-lg-9">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Add PurchaseType</h5>

          <form action="" method="post">

            {{ csrf_field() }}

            <div class="row mb-3">
              <label for="inputEmail3" class="col-md-2 col-form-label">Name</label>
              <div class="col-md-10">
                <input style="transition:.3s" type="text" name="purchase_type" required class="form-control"
                  id="inputText">
              </div>
            </div>

            <!-- Description Input -->
            <div class="row mb-3">
              <label for="description" class="col-md-2 col-form-label">Description</label>
              <div class="col-md-10">
                <textarea name="description" class="form-control" id="description" rows="3"></textarea>
              </div>
            </div>

            <!-- Estimated Cost Input -->
            <div class="row mb-3">
              <label for="estimated_cost" class="col-md-2 col-form-label">Estimated Cost</label>
              <div class="col-md-10">
                <input type="text" name="estimated_cost" placeholder="e.g., 5000 - 50000" required class="form-control"
                  id="estimated_cost">
              </div>
            </div>

            <div class="text-center mt-5">
              <button type="submit" class="btn btn-primary">Submit</button>
              <a type="cancel" href="{{ url()->previous() }}" class="btn btn-secondary">Cancel</a>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</section>


@endsection