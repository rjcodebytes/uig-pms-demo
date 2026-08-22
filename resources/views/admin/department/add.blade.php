@extends('admin.layout.app')

@section('content')

    <div class="pagetitle">
      <h1>DEPARTMENTS</h1>
    </div>

    <section class="section">
        <div class="row">
          <div class="col-lg-8">
            <div class="card">
                <div class="card-body">
                <h5 class="card-title">Add New Department</h5>

                <form action="" method="post">

                    {{ csrf_field() }}

                    <div class="row mb-3">
                    <label for="inputEmail3" class="col-md-2 col-form-label">Name</label>
                    <div class="col-md-10">
                        <input style="transition:.3s" type="text" name="deptname" required class="form-control" id="inputText">
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

  </main>

@endsection

