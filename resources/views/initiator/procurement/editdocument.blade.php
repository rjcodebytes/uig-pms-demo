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
        <li class="breadcrumb-item active"><a href="#">Edit Procurement</a></li>
      </ol>
    </nav>
  </div>

@include('_message')

<div class="container">

    <section class="section d-flex flex-column align-items-center justify-content-center py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 col-md-8 d-flex flex-column align-items-center justify-content-center">
            <div class="card mb-3">
                <div class="card-body">

                    <div class="pt-4 pb-2">
                    <h5 class="card-title text-center pb-0 fs-4">Edit Procurement</h5>
                    <p class="text-center small">Modify suggested changes to the procurement document.</p>
                    </div>

                    <form class="row g-3" action="{{ url('/submit-document/'.$document->doc_id) }}" method="post" enctype="multipart/form-data">
                        {{ csrf_field() }}

                        <div class="col-12">
                            <label for="doc_title" class="form-label">Document Title*</label>
                            <input type="text" value="{{$document->doc_title}}" name="doc_title" class="form-control" required>
                        </div>

                        <div class="col-12">
                            <label for="doc_desc" class="form-label">Description*</label>
                            <textarea rows="5" class="form-control" name="doc_desc" required>{{$document->doc_desc}}</textarea>
                        </div>

                        <div class="col-7">
                            <label for="document" class="form-label">Upload Document (PDF)*</label>
                            <input type="file" class="form-control" name="document" accept="application/pdf">
                        </div>
                        <div class="col-5">
                            <label for="document" class="form-label">Previously Uploaded Document</label>
                            <div><a type="button" href="{{ route('document.view', ['id' => $document->doc_id]) }}" target="_blank" class="btn btn-primary btn-md mt-2"><i class="bi bi-eye-fill"></i> View </a></div>
                        </div>

                        <div class="d-flex justify-content-center align-items-center mt-4">
                            <div class="col-3">
                                <button type="submit" class="btn btn-primary w-100">Upload Document</button>
                            </div>
                            <div class="col-3 ms-3">
                                <a href="{{ url()->previous() }}" class="btn btn-secondary w-100">Cancel</a>
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

@endsection

