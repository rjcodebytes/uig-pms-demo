@extends('approver.layout.app')

@section("content")

<div class="pagetitle">
    <h3>PROCUREMENT</h3>
</div>

@include('_message')

<div class="pagetitle">
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{ url('approver/dashboard')}}">Home</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('approver/procurement')}}">Procurement</a></li>
      <li class="breadcrumb-item active"><a href="?">Submit Response</a></li>
    </ol>
  </nav>
</div>


<section class="section dashboard">

    <div class="card">

        <div class="card-body">

            <div class="pt-4 pb-2">
                <h5 class="card-title text-center pb-0 fs-4">Document Details</h5>
                {{-- <p class="text-center small">View and manage document information</p> --}}
            </div>

            <!-- Document Metadata -->
            <div class="card mb-4">
                <div class="card-body">
                    <h5 class="card-title">Document Metadata</h5>
                    <div class="row">
                        <div class="col-md-3">
                            <p><strong>Document ID:</strong> DOC{{$document->doc_id}}</p>
                        </div>
                        <div class="col-md-5">
                            <p><strong>Title:</strong> {{$document->doc_title}}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>Uploaded On:</strong> {{$document->created_at->format('d/m/Y') }}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                            <p><strong>Initiator:</strong> {{$initiator->name}}</p>
                        </div>
                        <div class="col-md-5">
                            <p><strong>Department:</strong> {{$department->name}}</p>
                        </div>
                        <div class="col-md-4">
                            <p><strong>Status:</strong> {{$document->status}}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Forward Request Form -->
            <div class="card">
                <div class="card-body">
                    <div class="pt-4 pb-2">
                        <h5 class="card-title text-center pb-0 fs-4">Submit Response</h5>
                        <p class="text-center small">Submit your response to accept or reject the procurement</p>
                        </div>

                        <form class="row g-3" action="{{  url('/submit-response/'.$document->doc_id) }}" method="post">
                            {{ csrf_field() }}

                            <div class="col-12">
                                <label class="form-label">Action*</label>
                                <div class="d-flex">
                                    <div class="form-check me-3">
                                        <input class="form-check-input" type="radio" name="action" id="accept" value="Approved" required>
                                        <label class="form-check-label" for="accept">Accept</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="action" id="reject" value="Rejected" required>
                                        <label class="form-check-label" for="reject">Reject</label>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <label for="doc_desc" class="form-label">Remark</label>
                                <textarea rows="5"  class="form-control" name="remark" required></textarea>
                            </div>

                            <div class="d-flex justify-content-center align-items-center mt-4">
                                <div class="col-3">
                                    <button type="submit" class="btn btn-primary w-100">Submit</button>
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
      </div>
    </div>

    </section>

@endsection
