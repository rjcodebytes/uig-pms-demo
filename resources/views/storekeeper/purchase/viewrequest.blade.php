@extends('storekeeper.layout.app')

@section("content")

<div class="pagetitle">
    <h3>PURCHASE REQUEST</h3>
</div>

@include('_message')

<div class="pagetitle">
  <nav>
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="{{ url('storekeeper/dashboard')}}">Home</a></li>
      <li class="breadcrumb-item active"><a href="{{ url('storekeeper/purchase')}}">Purchase Request</a></li>
      <li class="breadcrumb-item active"><a href="#">View Request</a></li>
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

            <!-- Additional Details Table -->
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Additional Details</h5>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">Field</th>
                                    <th scope="col">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Description</td>
                                    <td>{{$document->doc_desc}}</td>
                                </tr>
                                <tr>
                                    <td>Purchase Type</td>
                                    <td>{{$purchase_type->name}}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>{{$purchase_type->description}}</td>
                                </tr>
                                <tr>
                                    <td>Estimated Cost</td>
                                    <td>Rs. {{$purchase_type->estimated_cost}}</td>
                                </tr>
                                <tr>
                                    <td>Last Updated</td>
                                    <td>{{$document->updated_at->format('d/m/Y')}} {{$document->updated_at->format('H:i:s')}}</td>
                                </tr>
                                <tr>
                                    <td>View Uploaded Document</td>
                                    <td><a type="button" href="{{ route('document.view', ['id' => $document->doc_id]) }}" target="_blank" class="btn btn-primary btn-md mt-2"><i class="ri-file-text-fill"></i> Uploaded Document</a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="text-center mt-4">
                <a href="{{ url()->previous() }}" class="btn btn-secondary">Back to List</a>
            </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    </section>

@endsection
